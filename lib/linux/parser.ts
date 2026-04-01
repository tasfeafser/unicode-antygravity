import { VirtualFileSystem, FSNode } from './filesystem'

export interface CommandResult {
  output: string
  error?: boolean
}

export class CommandParser {
  fs: VirtualFileSystem
  user: string = 'student'

  constructor(fs: VirtualFileSystem) {
    this.fs = fs
  }

  execute(rawCmd: string): CommandResult {
    const cmdStr = rawCmd.trim()
    if (!cmdStr) return { output: '' }

    const args = cmdStr.split(/\s+/)
    const command = args[0]
    const params = args.slice(1)

    try {
      switch (command) {
        case 'pwd':
          return { output: this.fs.getPwd() }
        
        case 'whoami':
          return { output: this.user }

        case 'clear':
          return { output: '\x1b[2J\x1b[3J\x1b[H' } // ANSI clear screen

        case 'ls':
          return this.cmdLs(params)

        case 'cd':
          return this.cmdCd(params)
        
        case 'cat':
          return this.cmdCat(params)

        case 'mkdir':
          return this.cmdMkdir(params)
        
        case 'touch':
          return this.cmdTouch(params)

        case 'rm':
          return this.cmdRm(params)
        
        case 'echo':
          return { output: params.join(' ') }

        case 'ping':
          return this.cmdPing(params)
          
        case 'nmap':
          return this.cmdNmap(params)

        case 'sudo':
          return { output: 'unicode is not in the sudoers file. This incident will be reported.', error: true }

        default:
          return { output: `bash: ${command}: command not found`, error: true }
      }
    } catch (e: any) {
      return { output: `bash: ${e.message}`, error: true }
    }
  }

  private cmdLs(params: string[]): CommandResult {
    const pathArg = params.find(p => !p.startsWith('-')) || '.'
    const isLong = params.some(p => p.includes('l'))
    
    const node = this.fs.getNode(pathArg)
    if (!node) return { output: `ls: cannot access '${pathArg}': No such file or directory`, error: true }
    if (node.type !== 'dir') return { output: node.name }

    if (!node.children) return { output: '' }
    
    const entries = Object.values(node.children)
    
    if (isLong) {
      const output = entries.map(n => 
        `${n.permissions} 1 ${n.owner} ${n.group} 4096 Oct 12 10:00 ${n.name}`
      ).join('\n')
      return { output }
    }

    return { output: entries.map(n => n.name).join('  ') }
  }

  private cmdCd(params: string[]): CommandResult {
    let target = params[0] || '/home/student'
    if (target === '~') target = '/home/student'

    const node = this.fs.getNode(target)
    if (!node) return { output: `cd: ${target}: No such file or directory`, error: true }
    if (node.type !== 'dir') return { output: `cd: ${target}: Not a directory`, error: true }

    this.fs.cwd = this.fs.resolvePath(target)
    return { output: '' }
  }

  private cmdCat(params: string[]): CommandResult {
    if (params.length === 0) return { output: '' }
    
    let outputs = []
    for (const tgt of params) {
      const node = this.fs.getNode(tgt)
      if (!node) {
        outputs.push(`cat: ${tgt}: No such file or directory`)
      } else if (node.type === 'dir') {
        outputs.push(`cat: ${tgt}: Is a directory`)
      } else {
        if (node.permissions.charAt(7) === '-' && this.user !== 'root' && node.owner === 'root') {
          outputs.push(`cat: ${tgt}: Permission denied`)
        } else {
          outputs.push(node.content || '')
        }
      }
    }
    return { output: outputs.join('\n') }
  }

  private cmdMkdir(params: string[]): CommandResult {
    if (params.length === 0) return { output: `mkdir: missing operand`, error: true }
    
    for (const tgt of params) {
      const parts = this.fs.resolvePath(tgt)
      const newName = parts.pop()
      if (!newName) continue

      const parentNode = this.fs.getNode('/' + parts.join('/')) || this.fs.getNode(parts.join('/'))
      
      if (!parentNode || parentNode.type !== 'dir') {
         return { output: `mkdir: cannot create directory '${tgt}': No such file or directory`, error: true }
      }
      
      if (!parentNode.children) parentNode.children = {}
      if (parentNode.children[newName]) {
        return { output: `mkdir: cannot create directory '${tgt}': File exists`, error: true }
      }

      parentNode.children[newName] = {
        name: newName,
        type: 'dir',
        permissions: 'drwxr-xr-x',
        owner: this.user,
        group: this.user,
        children: {}
      }
    }
    return { output: '' }
  }

  private cmdTouch(params: string[]): CommandResult {
    if (params.length === 0) return { output: `touch: missing file operand`, error: true }
    
    for (const tgt of params) {
      const parts = this.fs.resolvePath(tgt)
      const newName = parts.pop()
      if (!newName) continue

      const parentNode = this.fs.getNode('/' + parts.join('/')) || this.fs.getNode(parts.join('/'))
      
      if (!parentNode || parentNode.type !== 'dir') {
         return { output: `touch: cannot touch '${tgt}': No such file or directory`, error: true }
      }
      
      if (!parentNode.children) parentNode.children = {}
      if (!parentNode.children[newName]) {
        parentNode.children[newName] = {
          name: newName,
          type: 'file',
          content: '',
          permissions: '-rw-r--r--',
          owner: this.user,
          group: this.user
        }
      }
    }
    return { output: '' }
  }

  private cmdRm(params: string[]): CommandResult {
    if (params.length === 0) return { output: `rm: missing operand`, error: true }
    const isRecursive = params.some(p => p.includes('r') || p.includes('R'))
    const targets = params.filter(p => !p.startsWith('-'))

    for (const tgt of targets) {
      const parts = this.fs.resolvePath(tgt)
      const targetName = parts.pop()
      if (!targetName) continue

      const parentNode = this.fs.getNode(parts.length ? '/' + parts.join('/') : '/')
      
      if (!parentNode || !parentNode.children || !parentNode.children[targetName]) {
         return { output: `rm: cannot remove '${tgt}': No such file or directory`, error: true }
      }

      const nodeToDelete = parentNode.children[targetName]
      if (nodeToDelete.type === 'dir' && !isRecursive) {
        return { output: `rm: cannot remove '${tgt}': Is a directory`, error: true }
      }

      delete parentNode.children[targetName]
    }
    return { output: '' }
  }

  private cmdPing(params: string[]): CommandResult {
    const target = params[0] || 'localhost'
    return { 
      output: `PING ${target} (192.168.1.1) 56(84) bytes of data.\n64 bytes from ${target} (192.168.1.1): icmp_seq=1 ttl=64 time=0.034 ms\n64 bytes from ${target} (192.168.1.1): icmp_seq=2 ttl=64 time=0.045 ms\n64 bytes from ${target} (192.168.1.1): icmp_seq=3 ttl=64 time=0.041 ms\n\n--- ${target} ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2045ms` 
    }
  }

  private cmdNmap(params: string[]): CommandResult {
    const target = params.find(p => !p.startsWith('-')) || 'localhost'
    return {
      output: `Starting Nmap 7.92 ( https://nmap.org ) at 2026-10-12 10:05 UTC\nNmap scan report for ${target} (192.168.1.1)\nHost is up (0.00013s latency).\nNot shown: 998 closed tcp ports (reset)\nPORT   STATE SERVICE\n22/tcp open  ssh\n80/tcp open  http\n\nNmap done: 1 IP address (1 host up) scanned in 0.11 seconds`
    }
  }
}
