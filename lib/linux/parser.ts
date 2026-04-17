import { VirtualFileSystem, FSNode } from './filesystem'

export interface CommandResult {
  output: string
  error?: boolean
}

// Simulated network data
const FAKE_PROCESSES = `  PID TTY          TIME CMD
    1 ?        00:00:02 systemd
  412 ?        00:00:00 sshd
  891 pts/0    00:00:00 bash
  934 pts/0    00:00:00 node
 1042 pts/0    00:00:00 ps`

const FAKE_IFCONFIG = `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.105  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)
        RX packets 12089  bytes 14214390 (14.2 MB)
        TX packets 7432  bytes 892431 (892.4 KB)

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)`

const FAKE_NETSTAT = `Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN
tcp        0      0 127.0.0.1:5432          0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:3389            0.0.0.0:*               LISTEN`

const FAKE_TOP = `top - 10:14:32 up 2 days, 3:42,  1 user,  load average: 0.12, 0.08, 0.05
Tasks:  89 total,   1 running,  88 sleeping,   0 stopped,   0 zombie
%Cpu(s):  2.3 us,  0.7 sy,  0.0 ni, 96.8 id,  0.2 wa,  0.0 hi,  0.0 si
MiB Mem :   1982.3 total,    514.2 free,    831.1 used,    637.0 buff/cache
MiB Swap:   2048.0 total,   2038.2 free,      9.8 used.    981.4 avail Mem

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
  934 student   20   0  719828  54328  35264 S   1.7   2.7   0:01.23 node
  412 root      20   0   72308   8112   6416 S   0.3   0.4   0:00.87 sshd
    1 root      20   0  167844  11916   8384 S   0.0   0.6   0:02.14 systemd`

const FAKE_DF = `Filesystem     1K-blocks    Used Available Use% Mounted on
/dev/sda1       51473776 4182584  44632820   9% /
tmpfs             992236       0    992236   0% /dev/shm
/dev/sda2        5120000  102400   4915200   3% /boot`

const FAKE_FREE = `               total        used        free      shared  buff/cache   available
Mem:         2029620      851020      526520        4212      652080     1004720
Swap:        2097148       10040     2087108`

const FAKE_UNAME = `Linux unicode-os 5.15.0-88-generic #98-Ubuntu SMP Mon Oct  2 15:18:56 UTC 2026 x86_64 x86_64 x86_64 GNU/Linux`

const FAKE_HISTORY = `1  ls -la
2  cd /var/www
3  cat /etc/passwd
4  ls
5  mkdir project
6  touch project/index.html
7  ping google.com
8  nmap localhost
9  ifconfig
10  netstat -an
11  ps aux
12  whoami
13  pwd
14  uname -a
15  history`

const FAKE_CRONTAB = `# Edit this file to introduce tasks to be run by cron.
# m h  dom mon dow   command
0 * * * * /usr/bin/backup.sh
30 6 * * 1-5 /usr/bin/update-db.sh
*/5 * * * * /usr/bin/health-check.sh`

export class CommandParser {
  fs: VirtualFileSystem
  user: string = 'student'

  constructor(fs: VirtualFileSystem) {
    this.fs = fs
  }

  execute(rawCmd: string): CommandResult {
    const cmdStr = rawCmd.trim()
    if (!cmdStr) return { output: '' }

    // Handle pipe symbol rudimentarily
    if (cmdStr.includes('|')) {
      const parts = cmdStr.split('|').map(s => s.trim())
      const firstResult = this.execute(parts[0])
      return firstResult
    }

    const args = cmdStr.split(/\s+/)
    const command = args[0]
    const params = args.slice(1)

    try {
      switch (command) {
        // ── Navigation ──────────────────────────────────────────
        case 'pwd':      return { output: this.fs.getPwd() }
        case 'whoami':   return { output: this.user }
        case 'id':       return { output: `uid=1000(${this.user}) gid=1000(${this.user}) groups=1000(${this.user}),4(adm),24(cdrom),27(sudo)` }
        case 'clear':    return { output: '\x1b[2J\x1b[3J\x1b[H' }
        case 'ls':       return this.cmdLs(params)
        case 'cd':       return this.cmdCd(params)
        case 'cat':      return this.cmdCat(params)
        case 'less':
        case 'more':     return this.cmdCat(params)

        // ── File Operations ──────────────────────────────────────
        case 'mkdir':    return this.cmdMkdir(params)
        case 'touch':    return this.cmdTouch(params)
        case 'rm':       return this.cmdRm(params)
        case 'cp':       return this.cmdCp(params)
        case 'mv':       return this.cmdMv(params)
        case 'echo':     return this.cmdEcho(params, rawCmd)
        case 'find':     return this.cmdFind(params)
        case 'grep':     return this.cmdGrep(params)
        case 'head':     return this.cmdHead(params)
        case 'tail':     return this.cmdTail(params)
        case 'wc':       return this.cmdWc(params)
        case 'chmod':    return this.cmdChmod(params)
        case 'chown':    return { output: '' }
        case 'tar':      return this.cmdTar(params)
        case 'unzip':    return { output: `Archive:  ${params[0] || 'file.zip'}\n  inflating: file.txt\n  inflating: readme.md\nDone.` }
        case 'nano':
        case 'vim':
        case 'vi':       return { output: `[${command}] is simulated. File open stub: ${params[0] || '(no file)'}. Press Ctrl+C to exit.` }

        // ── System Info ──────────────────────────────────────────
        case 'uname':    return { output: params.includes('-a') ? FAKE_UNAME : 'Linux' }
        case 'uptime':   return { output: ' 10:14:32 up 2 days, 3:42,  1 user,  load average: 0.12, 0.08, 0.05' }
        case 'free':     return { output: FAKE_FREE }
        case 'df':       return { output: FAKE_DF }
        case 'du':       return { output: `8.0K\t${params[0] || '.'}` }
        case 'ps':       return { output: params.includes('aux') ? this.cmdPsAux() : FAKE_PROCESSES }
        case 'top':
        case 'htop':     return { output: FAKE_TOP }
        case 'env':      return { output: `HOME=/home/${this.user}\nUSER=${this.user}\nSHELL=/bin/bash\nPATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin\nTERM=xterm-256color\nLANG=en_US.UTF-8` }
        case 'printenv': return { output: `HOME=/home/${this.user}\nUSER=${this.user}\nSHELL=/bin/bash` }
        case 'history':  return { output: FAKE_HISTORY }
        case 'date':     return { output: new Date().toString() }
        case 'crontab':  return params.includes('-l') ? { output: FAKE_CRONTAB } : { output: '' }

        // ── Network ──────────────────────────────────────────────
        case 'ping':        return this.cmdPing(params)
        case 'ifconfig':    return { output: FAKE_IFCONFIG }
        case 'ip':          return params[0] === 'addr' ? { output: FAKE_IFCONFIG } : { output: 'usage: ip [ OPTIONS ] OBJECT { COMMAND | help }' }
        case 'netstat':     return { output: FAKE_NETSTAT }
        case 'ss':          return { output: FAKE_NETSTAT }
        case 'curl':        return this.cmdCurl(params)
        case 'wget':        return this.cmdWget(params)
        case 'traceroute':
        case 'tracert':     return this.cmdTraceroute(params)
        case 'whois':       return this.cmdWhois(params)
        case 'dig':         return this.cmdDig(params)
        case 'nslookup':    return this.cmdNslookup(params)
        case 'ssh':         return this.cmdSsh(params)
        case 'ssh-keygen':  return this.cmdSshKeygen(params)
        case 'scp':         return { output: `${params[params.length - 1] || 'file'}: No such file or directory`, error: true }

        // ── Security Tools ───────────────────────────────────────
        case 'nmap':        return this.cmdNmap(params)
        case 'hydra':       return this.cmdHydra(params)
        case 'nikto':       return this.cmdNikto(params)
        case 'gobuster':    return this.cmdGobuster(params)
        case 'john':        return this.cmdJohn(params)
        case 'hashcat':     return { output: `hashcat (v6.2.6)\nSession..........: hashcat\nStatus...........: Running\nHash.Mode........: 0 (MD5)\nRecovered........: 1/3 (33.33%)\n\n* Hash: 5f4dcc3b5aa765d61d8327deb882cf99 -> password` }
        case 'metasploit':
        case 'msfconsole':  return { output: `\x1b[31m[*] Metasploit is simulated in this environment.\n[*] Type help to see available simulated commands.\x1b[0m` }

        // ── Dev Tools ────────────────────────────────────────────
        case 'git':         return this.cmdGit(params)
        case 'python':
        case 'python3':     return this.cmdPython(params)
        case 'node':        return this.cmdNode(params)
        case 'npm':         return this.cmdNpm(params)
        case 'pip':
        case 'pip3':        return this.cmdPip(params)

        // ── System Control ───────────────────────────────────────
        case 'sudo':        return this.cmdSudo(params)
        case 'su':          return { output: 'Password: \nauthentication failure', error: true }
        case 'man':         return this.cmdMan(params)
        case 'help':        return this.cmdHelp()
        case 'alias':       return { output: `alias ll='ls -alF'\nalias la='ls -A'\nalias l='ls -CF'` }
        case 'which':       return { output: `/usr/bin/${params[0] || 'bash'}` }
        case 'whereis':     return { output: `${params[0] || 'ls'}: /bin/${params[0] || 'ls'} /usr/share/man/man1/${params[0] || 'ls'}.1.gz` }
        case 'kill':        return { output: '' }
        case 'killall':     return { output: '' }
        case 'shutdown':    return { output: 'Simulated: Shutdown would be executed in 1 minute. (This is a sandbox)' }
        case 'reboot':      return { output: 'Simulated: System would reboot. (This is a sandbox)' }
        case 'last':        return { output: `${this.user}  pts/0  192.168.1.50  Mon Apr 17 10:10   still logged in\nwtmp begins Mon Apr 17 09:00:00 2026` }
        case 'w':           return { output: ` 10:14:32 up 2 days,  3:42,  1 user,  load average: 0.12, 0.08, 0.05\nUSER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT\n${this.user}  pts/0    192.168.1.50     10:10    0.00s  0.02s  0.00s w` }
        case 'who':         return { output: `${this.user} pts/0        2026-04-17 10:10 (192.168.1.50)` }
        case 'useradd':     return { output: '' }
        case 'passwd':      return { output: 'New password: \nRetype new password: \npasswd: password updated successfully' }
        case 'groups':      return { output: `${this.user} adm sudo` }
        case 'service':     return this.cmdService(params)
        case 'systemctl':   return this.cmdSystemctl(params)
        case 'journalctl':  return { output: `Apr 17 10:10:01 unicode-os sshd[412]: Accepted password for ${this.user} from 192.168.1.50 port 52341 ssh2\nApr 17 10:10:01 unicode-os systemd-logind[389]: New session 3 of user ${this.user}.\nApr 17 10:14:32 unicode-os kernel: [12345.678901] device eth0 not ready` }
        case 'lsof':        return { output: `COMMAND   PID     USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME\nbash       891  ${this.user}  cwd    DIR              8,1     4096    2 /home/${this.user}\nnode       934  ${this.user}  cwd    DIR              8,1     4096   18 /var/www` }
        case 'strace':      return { output: `execve("${params[0] || '/bin/ls'}", ["${params[0] || 'ls'}"], 0x7ffd1234 /* 12 vars */) = 0\nbrk(NULL) = 0x55a1234\n...strace is simulated` }
        case 'tcpdump':     return { output: `tcpdump: verbose output suppressed, use -v or -vv for full protocol decode\nlistening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes\n10:14:32.123456 IP 192.168.1.105.52341 > 192.168.1.1.80: Flags [S], seq 1234567890\n^C\n4 packets captured\n4 packets received by filter\n0 packets dropped by kernel` }
        case 'iptables':    return { output: 'Chain INPUT (policy ACCEPT)\ntarget     prot opt source               destination\nACCEPT     all  --  anywhere             anywhere             ctstate RELATED,ESTABLISHED\n\nChain FORWARD (policy DROP)\n\nChain OUTPUT (policy ACCEPT)' }
        case 'openssl':     return this.cmdOpenssl(params)

        default:
          return { output: `bash: ${command}: command not found\nTry 'help' to see available commands.`, error: true }
      }
    } catch (e: any) {
      return { output: `bash: ${e.message}`, error: true }
    }
  }

  // ── File System Commands ─────────────────────────────────────────

  private cmdLs(params: string[]): CommandResult {
    const pathArg = params.find(p => !p.startsWith('-')) || '.'
    const isLong = params.some(p => p.includes('l'))
    const isAll = params.some(p => p.includes('a'))
    const node = this.fs.getNode(pathArg)
    if (!node) return { output: `ls: cannot access '${pathArg}': No such file or directory`, error: true }
    if (node.type !== 'dir') return { output: node.name }
    if (!node.children) return { output: '' }
    const entries = Object.values(node.children)
    const dotEntries = isAll ? [
      { name: '.', type: 'dir', permissions: 'drwxr-xr-x', owner: this.user, group: this.user },
      { name: '..', type: 'dir', permissions: 'drwxr-xr-x', owner: 'root', group: 'root' },
      ...entries
    ] : entries
    if (isLong) {
      const header = isAll ? `total ${dotEntries.length * 4}\n` : ''
      const rows = dotEntries.map((n: any) => {
        const color = n.type === 'dir' ? '\x1b[1;34m' : ''
        const reset = n.type === 'dir' ? '\x1b[0m' : ''
        return `${n.permissions} 1 ${n.owner || this.user} ${n.group || this.user} 4096 Apr 17 10:00 ${color}${n.name}${reset}`
      })
      return { output: header + rows.join('\n') }
    }
    const colored = dotEntries.map((n: any) =>
      n.type === 'dir' ? `\x1b[1;34m${n.name}\x1b[0m` : n.name
    )
    return { output: colored.join('  ') }
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
    const outputs: string[] = []
    for (const tgt of params) {
      const node = this.fs.getNode(tgt)
      if (!node) { outputs.push(`cat: ${tgt}: No such file or directory`); continue }
      if (node.type === 'dir') { outputs.push(`cat: ${tgt}: Is a directory`); continue }
      if (node.permissions?.charAt(7) === '-' && this.user !== 'root' && node.owner === 'root') {
        outputs.push(`cat: ${tgt}: Permission denied`); continue
      }
      outputs.push(node.content || '')
    }
    return { output: outputs.join('\n') }
  }

  private cmdMkdir(params: string[]): CommandResult {
    if (params.length === 0) return { output: `mkdir: missing operand`, error: true }
    const realParams = params.filter(p => !p.startsWith('-'))
    for (const tgt of realParams) {
      const parts = this.fs.resolvePath(tgt)
      const newName = parts.pop()
      if (!newName) continue
      const parentPath = parts.length ? '/' + parts.join('/') : '/'
      const parentNode = this.fs.getNode(parentPath) || this.fs.getNode(parts.join('/'))
      if (!parentNode || parentNode.type !== 'dir') return { output: `mkdir: cannot create directory '${tgt}': No such file or directory`, error: true }
      if (!parentNode.children) parentNode.children = {}
      if (parentNode.children[newName]) return { output: `mkdir: cannot create directory '${tgt}': File exists`, error: true }
      parentNode.children[newName] = { name: newName, type: 'dir', permissions: 'drwxr-xr-x', owner: this.user, group: this.user, children: {} }
    }
    return { output: '' }
  }

  private cmdTouch(params: string[]): CommandResult {
    if (params.length === 0) return { output: `touch: missing file operand`, error: true }
    for (const tgt of params) {
      const parts = this.fs.resolvePath(tgt)
      const newName = parts.pop()
      if (!newName) continue
      const parentPath = '/' + parts.join('/')
      const parentNode = this.fs.getNode(parentPath) || this.fs.getNode(parts.join('/'))
      if (!parentNode || parentNode.type !== 'dir') return { output: `touch: cannot touch '${tgt}': No such file or directory`, error: true }
      if (!parentNode.children) parentNode.children = {}
      if (!parentNode.children[newName]) {
        parentNode.children[newName] = { name: newName, type: 'file', content: '', permissions: '-rw-r--r--', owner: this.user, group: this.user }
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
      if (!parentNode || !parentNode.children || !parentNode.children[targetName]) return { output: `rm: cannot remove '${tgt}': No such file or directory`, error: true }
      const node = parentNode.children[targetName]
      if (node.type === 'dir' && !isRecursive) return { output: `rm: cannot remove '${tgt}': Is a directory`, error: true }
      delete parentNode.children[targetName]
    }
    return { output: '' }
  }

  private cmdCp(params: string[]): CommandResult {
    if (params.length < 2) return { output: `cp: missing destination file operand`, error: true }
    return { output: '' }
  }

  private cmdMv(params: string[]): CommandResult {
    if (params.length < 2) return { output: `mv: missing destination file operand`, error: true }
    return { output: '' }
  }

  private cmdEcho(params: string[], rawCmd: string): CommandResult {
    // Handle echo with redirect
    if (rawCmd.includes('>')) {
      const parts = rawCmd.split('>')
      const text = parts[0].replace('echo', '').trim().replace(/^["']|["']$/g, '')
      const file = parts[1].trim()
      const touch = this.cmdTouch([file])
      if (!touch.error) {
        const node = this.fs.getNode(file)
        if (node) node.content = text
      }
      return { output: '' }
    }
    const text = params.join(' ').replace(/^["']|["']$/g, '')
    return { output: text }
  }

  private cmdFind(params: string[]): CommandResult {
    const path = params[0] || '.'
    const nameFlag = params.indexOf('-name')
    const name = nameFlag !== -1 ? params[nameFlag + 1] : '*'
    return { output: `${path}/index.html\n${path}/style.css\n${path}/main.js\n${path}/README.md` }
  }

  private cmdGrep(params: string[]): CommandResult {
    if (params.length < 2) return { output: `Usage: grep PATTERN FILE`, error: true }
    const pattern = params[0]
    const file = params.filter(p => !p.startsWith('-')).slice(1)[0] || ''
    return { output: `${file}:  line containing "${pattern}" found at line 12\n${file}:  another match at line 47` }
  }

  private cmdHead(params: string[]): CommandResult {
    const file = params.filter(p => !p.startsWith('-'))[0] || ''
    if (!file) return { output: '', error: true }
    const node = this.fs.getNode(file)
    if (!node) return { output: `head: cannot open '${file}' for reading: No such file or directory`, error: true }
    const lines = (node.content || '').split('\n').slice(0, 10)
    return { output: lines.join('\n') }
  }

  private cmdTail(params: string[]): CommandResult {
    const file = params.filter(p => !p.startsWith('-'))[0] || ''
    if (!file) return { output: '', error: true }
    const node = this.fs.getNode(file)
    if (!node) return { output: `tail: cannot open '${file}' for reading: No such file or directory`, error: true }
    const lines = (node.content || '').split('\n').slice(-10)
    return { output: lines.join('\n') }
  }

  private cmdWc(params: string[]): CommandResult {
    const file = params.filter(p => !p.startsWith('-'))[0] || ''
    if (!file) return { output: `0 0 0`, error: false }
    const node = this.fs.getNode(file)
    if (!node || node.type !== 'file') return { output: `wc: ${file}: No such file or directory`, error: true }
    const content = node.content || ''
    const lines = content.split('\n').length
    const words = content.split(/\s+/).filter(Boolean).length
    const bytes = content.length
    return { output: ` ${lines} ${words} ${bytes} ${file}` }
  }

  private cmdChmod(params: string[]): CommandResult {
    if (params.length < 2) return { output: `chmod: missing operand`, error: true }
    const mode = params[0]
    const file = params[1]
    const node = this.fs.getNode(file)
    if (!node) return { output: `chmod: cannot access '${file}': No such file or directory`, error: true }
    return { output: `Changed permissions of '${file}' to ${mode}` }
  }

  private cmdTar(params: string[]): CommandResult {
    if (params.includes('-xzf') || params.includes('-xf')) {
      const file = params.find(p => !p.startsWith('-')) || 'archive.tar.gz'
      return { output: `x ${file.replace(/\.tar\.gz|\.tgz/, '')}/\nx ${file.replace(/\.tar\.gz|\.tgz/, '')}/README.md\nx ${file.replace(/\.tar\.gz|\.tgz/, '')}/main.py\nExtraction complete.` }
    }
    if (params.includes('-czf') || params.includes('-cf')) {
      return { output: '' }
    }
    if (params.includes('-tzf') || params.includes('-tf')) {
      const file = params.find(p => !p.startsWith('-')) || ''
      return { output: `${file.replace(/\.tar\.gz|\.tgz/, '')}/\n${file.replace(/\.tar\.gz|\.tgz/, '')}/main.py\n${file.replace(/\.tar\.gz|\.tgz/, '')}/README.md` }
    }
    return { output: `tar: You must specify one of the '-Acdtrux', '--delete' or '--test-label' options` }
  }

  // ── System Commands ──────────────────────────────────────────────

  private cmdPsAux(): string {
    return `USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root           1  0.0  0.5  167844 11916 ?        Ss   Apr15   0:02 /sbin/init
root         412  0.0  0.4   72308  8112 ?        Ss   Apr15   0:00 sshd: /usr/sbin/sshd
${this.user}     891  0.0  0.1   21512  3052 pts/0    Ss   10:10   0:00 -bash
${this.user}     934  0.5  2.7  719828 54328 pts/0   Sl   10:10   0:01 node server.js
${this.user}     935  0.0  0.1   36596  3512 pts/0    S+   10:14   0:00 ps aux`
  }

  private cmdSudo(params: string[]): CommandResult {
    if (this.user === 'root') {
      return this.execute(params.join(' '))
    }
    return { output: `[sudo] password for ${this.user}: \n${this.user} is not in the sudoers file. This incident will be reported.`, error: true }
  }

  private cmdService(params: string[]): CommandResult {
    const svc = params[0] || ''
    const action = params[1] || ''
    const statuses: Record<string, string> = {
      'apache2': 'active (running)',
      'nginx': 'active (running)',
      'ssh': 'active (running)',
      'mysql': 'inactive (dead)',
      'postgresql': 'active (running)',
    }
    if (action === 'status') {
      return { output: `● ${svc}.service - ${svc} service\n   Loaded: loaded (/lib/systemd/system/${svc}.service; enabled)\n   Active: ${statuses[svc] || 'unknown'}` }
    }
    return { output: `${svc}: ${action} done.` }
  }

  private cmdSystemctl(params: string[]): CommandResult {
    const action = params[0] || ''
    const svc = params[1] || ''
    if (action === 'status') {
      return { output: `● ${svc}.service\n   Loaded: loaded\n   Active: active (running) since Mon 2026-04-17 10:10:01 UTC; 4min ago\n Main PID: 412` }
    }
    if (action === 'list-units') {
      return { output: `UNIT                          LOAD   ACTIVE SUB     DESCRIPTION\nsshd.service                  loaded active running OpenSSH Server Daemon\nnginx.service                 loaded active running A high performance web server\npostgresql.service            loaded active running PostgreSQL Database\n\nLoaded: 3; Active: 3` }
    }
    return { output: '' }
  }

  private cmdMan(params: string[]): CommandResult {
    if (!params[0]) return { output: 'What manual page do you want?', error: true }
    const manPages: Record<string, string> = {
      'ls': 'LS(1)\n\nNAME\n    ls - list directory contents\n\nSYNOPSIS\n    ls [OPTION]... [FILE]...\n\nDESCRIPTION\n    List information about the FILEs (the current directory by default).\n    -a  do not ignore entries starting with .\n    -l  use a long listing format\n    -h  with -l, print sizes in human readable format',
      'nmap': 'NMAP(1)\n\nNAME\n    nmap - Network exploration tool and security/port scanner\n\nSYNOPSIS\n    nmap [Scan Type...] [Options] {target specification}\n\nOPTIONS\n    -sV  detect service/version info\n    -O   enable OS detection\n    -A   enable OS detection, version detection, script scanning\n    -p   only scan specified ports\n    -sS  TCP SYN scan (stealth)',
      'grep': 'GREP(1)\n\nNAME\n    grep - print lines that match patterns\n\nSYNOPSIS\n    grep [OPTION]... PATTERN [FILE]...\n\nOPTIONS\n    -i  ignore case distinctions\n    -r  read all files under each directory recursively\n    -n  print line number with output lines\n    -v  invert sense of matching',
    }
    return { output: manPages[params[0]] || `No manual entry for ${params[0]}` }
  }

  private cmdHelp(): CommandResult {
    return {
      output: `\x1b[1;36mUnicode OS v1.0 — Available Commands\x1b[0m

\x1b[1;33mNavigation:\x1b[0m    ls, cd, pwd, find
\x1b[1;33mFiles:\x1b[0m         cat, touch, mkdir, rm, cp, mv, echo, head, tail, wc, chmod, tar, nano, vim
\x1b[1;33mSystem:\x1b[0m        ps, top, htop, df, free, uname, uptime, history, env, date, who, w, id
\x1b[1;33mNetwork:\x1b[0m       ping, ifconfig, ip, netstat, curl, wget, traceroute, whois, dig, ssh
\x1b[1;33mSecurity:\x1b[0m      nmap, hydra, nikto, gobuster, john, hashcat, tcpdump, iptables, openssl
\x1b[1;33mDev:\x1b[0m           git, python3, node, npm, pip3
\x1b[1;33mOther:\x1b[0m         man, sudo, clear, help`
    }
  }

  // ── Network Commands ─────────────────────────────────────────────

  private cmdPing(params: string[]): CommandResult {
    const target = params.find(p => !p.startsWith('-')) || 'localhost'
    const count = (() => { const ci = params.indexOf('-c'); return ci !== -1 ? parseInt(params[ci + 1]) || 4 : 4 })()
    const lines = [`PING ${target} (93.184.216.34): 56 data bytes`]
    for (let i = 1; i <= count; i++) {
      const time = (Math.random() * 20 + 8).toFixed(3)
      lines.push(`64 bytes from 93.184.216.34: icmp_seq=${i} ttl=64 time=${time} ms`)
    }
    lines.push(`\n--- ${target} ping statistics ---`)
    lines.push(`${count} packets transmitted, ${count} received, 0% packet loss, time ${count * 1000 - 3}ms`)
    lines.push(`rtt min/avg/max/mdev = 8.234/13.541/18.901/3.421 ms`)
    return { output: lines.join('\n') }
  }

  private cmdCurl(params: string[]): CommandResult {
    const url = params.find(p => !p.startsWith('-')) || ''
    if (!url) return { output: `curl: no URL specified!`, error: true }
    if (url.includes('api') || url.includes('json')) {
      return { output: `{"status":"ok","message":"Hello from ${url}","timestamp":"${new Date().toISOString()}","server":"nginx/1.18.0"}` }
    }
    return { output: `<!DOCTYPE html>\n<html>\n<head><title>Sample Page</title></head>\n<body><h1>Welcome</h1><p>Content from ${url}</p></body>\n</html>` }
  }

  private cmdWget(params: string[]): CommandResult {
    const url = params.find(p => !p.startsWith('-')) || ''
    if (!url) return { output: `wget: missing URL`, error: true }
    const file = url.split('/').pop() || 'index.html'
    return { output: `--2026-04-17 10:14:32--  ${url}\nResolving ${url.replace(/https?:\/\//, '').split('/')[0]}... 93.184.216.34\nConnecting to ${url.replace(/https?:\/\//, '').split('/')[0]}... connected.\nHTTP request sent, awaiting response... 200 OK\nLength: 48126 (47K) [text/html]\nSaving to: '${file}'\n${file}         100%[========================================>]  47.00K  --.-KB/s    in 0.2s\n2026-04-17 10:14:32 (235 KB/s) - '${file}' saved [48126/48126]` }
  }

  private cmdTraceroute(params: string[]): CommandResult {
    const target = params.find(p => !p.startsWith('-')) || 'google.com'
    return {
      output: `traceroute to ${target} (142.250.80.46), 30 hops max, 60 byte packets
 1  _gateway (192.168.1.1)  0.412 ms  0.389 ms  0.371 ms
 2  10.10.0.1 (10.10.0.1)  4.231 ms  4.198 ms  4.178 ms
 3  72.14.204.68  8.392 ms  8.374 ms  8.356 ms
 4  108.170.252.1  10.201 ms  10.183 ms  10.165 ms
 5  142.250.80.46  11.204 ms  11.186 ms  11.168 ms`
    }
  }

  private cmdWhois(params: string[]): CommandResult {
    const target = params[0] || 'example.com'
    return {
      output: `Domain Name: ${target.toUpperCase()}
Registry Domain ID: 2336799_DOMAIN_COM-VRSN
Registrar WHOIS Server: whois.registrar.amazon
Registrar URL: https://registrar.amazon.com
Updated Date: 2023-08-14T07:01:44Z
Creation Date: 1995-08-14T04:00:00Z
Registry Expiry Date: 2025-08-13T04:00:00Z
Registrar: Amazon Registrar, Inc.
Name Server: ns1.example.tld
Name Server: ns2.example.tld
DNSSEC: unsigned`
    }
  }

  private cmdDig(params: string[]): CommandResult {
    const target = params.find(p => !p.startsWith('-') && !p.startsWith('@')) || 'example.com'
    return {
      output: `; <<>> DiG 9.16.1-Ubuntu <<>> ${target}
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0

;; QUESTION SECTION:
;${target}.       IN  A

;; ANSWER SECTION:
${target}.  3600  IN  A  93.184.216.34

;; Query time: 14 msec`
    }
  }

  private cmdNslookup(params: string[]): CommandResult {
    const target = params[0] || 'example.com'
    return { output: `Server:\t\t8.8.8.8\nAddress:\t8.8.8.8#53\n\nNon-authoritative answer:\nName:\t${target}\nAddress: 93.184.216.34` }
  }

  private cmdSsh(params: string[]): CommandResult {
    const target = params.find(p => !p.startsWith('-')) || ''
    if (!target) return { output: 'usage: ssh [-46AaCfGgKkMNnqsTtVvXxYy] [-B bind_interface]\n           [-b bind_address] user@hostname', error: true }
    return { output: `ssh: connect to host ${target} port 22: Connection refused\n(Sandbox: SSH connections are simulated)`, error: true }
  }

  private cmdSshKeygen(params: string[]): CommandResult {
    return {
      output: `Generating public/private rsa key pair.
Enter file in which to save the key (/home/${this.user}/.ssh/id_rsa): 
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /home/${this.user}/.ssh/id_rsa
Your public key has been saved in /home/${this.user}/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:kI9PtK3Yx7Lp/dQwRmN+2aV1JeZOcStHuWfXiBByME ${this.user}@unicode-os
The key's randomart image is:
+---[RSA 4096]----+
|       ..oo.     |
|      .  ooo.    |
|     . . .oo.    |
|      . o.o. .   |
|     . .S=. . .  |
|    . ..=+.  E   |
|     .=+o+    .  |
|    .+++o.       |
|   .=*B=.        |
+----[SHA256]-----+`
    }
  }

  // ── Security Commands ────────────────────────────────────────────

  private cmdNmap(params: string[]): CommandResult {
    const target = params.find(p => !p.startsWith('-')) || 'localhost'
    const isDetailed = params.some(p => p.includes('A') || p.includes('sV'))

    let output = `Starting Nmap 7.92 ( https://nmap.org ) at ${new Date().toUTCString()}
Nmap scan report for ${target} (192.168.1.1)
Host is up (0.00013s latency).
Not shown: 996 closed tcp ports (reset)\n`

    if (isDetailed) {
      output += `PORT     STATE  SERVICE   VERSION
22/tcp   open   ssh       OpenSSH 8.4 (protocol 2.0)
| ssh-hostkey:
|   3072 72:02:da:42:3c:b2:3c:4d:02:ab:ab:d2:0e:2d:aa:fe (RSA)
80/tcp   open   http      Apache httpd 2.4.51
| http-methods: GET HEAD POST OPTIONS
|_http-title: Apache2 Ubuntu Default Page
3306/tcp open   mysql     MySQL 8.0.27
| mysql-info: Protocol: 10; Version: 8.0.27
5432/tcp open   postgresql PostgreSQL DB 13.5
OS details: Linux 5.4 - 5.15
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel`
    } else {
      output += `PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
3306/tcp open  mysql
5432/tcp open  postgresql`
    }
    output += `\n\nNmap done: 1 IP address (1 host up) scanned in 2.34 seconds`
    return { output }
  }

  private cmdHydra(params: string[]): CommandResult {
    const target = params.find(p => !p.startsWith('-') && p !== 'hydra') || '192.168.1.1'
    const protocol = params[params.length - 1] || 'ssh'
    return {
      output: `Hydra v9.3 (c) 2022 by van Hauser/THC & David Maciejak

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at ${new Date().toUTCString()}
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[DATA] max 16 tasks per 1 server, overall 16 tasks, 14344399 login tries (l:1/p:14344399), ~896525 tries per task
[DATA] attacking ${protocol}://${target}:22/
[22][${protocol}] host: ${target}   login: admin   password: password123
[22][${protocol}] host: ${target}   login: root    password: toor
[STATUS] attack finished for ${target} (valid pair found)
2 of 2 target successfully completed, 2 valid passwords found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at ${new Date().toUTCString()}`
    }
  }

  private cmdNikto(params: string[]): CommandResult {
    const host = params.find((p, i) => params[i - 1] === '-h') || params.find(p => !p.startsWith('-')) || 'localhost'
    return {
      output: `- Nikto v2.1.6
---------------------------------------------------------------------------
+ Target IP:          192.168.1.1
+ Target Hostname:    ${host}
+ Target Port:        80
---------------------------------------------------------------------------
+ Server: Apache/2.4.51 (Ubuntu)
+ /: The anti-clickjacking X-Frame-Options header is not present.
+ /: The X-XSS-Protection header is not defined.
+ /: The X-Content-Type-Options header is not set.
+ No CGI Directories found (use '-C all' to force check all possible dirs)
+ /icons/README: Apache default file found.
+ /phpmyadmin/: phpMyAdmin directory found (CHECK ACCESS!)
+ /wp-login.php: Wordpress login found.
+ OSVDB-3268: /admin/: Directory indexing found.
+ OSVDB-3268: /backup/: Directory indexing found.
+ 7915 requests: 4 error(s) and 8 item(s) reported on remote host
+ End Time: ${new Date().toUTCString()} (34 seconds)`
    }
  }

  private cmdGobuster(params: string[]): CommandResult {
    const url = params.find((p, i) => params[i - 1] === '-u') || 'http://target.com'
    return {
      output: `===============================================================
Gobuster v3.1.0
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     ${url}
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/common.txt
[+] Negative Status codes:   404
[+] Timeout:                 10s
===============================================================
2026/04/17 10:14:32 Starting gobuster in directory enumeration mode
===============================================================
/admin                (Status: 200) [Size: 1234]
/backup               (Status: 403) [Size: 211]
/config               (Status: 403) [Size: 211]
/login                (Status: 200) [Size: 2341]
/phpmyadmin           (Status: 200) [Size: 10891]
/robots.txt           (Status: 200) [Size: 67]
/upload               (Status: 200) [Size: 512]
/wp-admin             (Status: 302) [Size: 0]
===============================================================
2026/04/17 10:14:54 Finished
===============================================================`
    }
  }

  private cmdJohn(params: string[]): CommandResult {
    const wordlist = params.find((p, i) => p.startsWith('--wordlist')) || '--wordlist=/usr/share/wordlists/rockyou.txt'
    const file = params.find(p => !p.startsWith('-')) || 'hashes.txt'
    return {
      output: `Using default input encoding: UTF-8
Loaded 3 password hashes with no different salts (MD5 [MD5 128/128 AVX 4x3])
Remaining 3 password hashes with no different salts
${wordlist.split('=')[1] || 'wordlist'}: 14344391 passwords; rules: Wordlist
Press 'q' or Ctrl-C to abort, almost any other key for status
password123      (user1)
admin            (admin)
letmein          (root)
3g 0:00:00:02 DONE (2026-04-17 10:14) 1.500g/s 3141K p/s
Use the "--show" option to display all of the cracked passwords reliably`
    }
  }

  private cmdOpenssl(params: string[]): CommandResult {
    const cmd = params[0] || ''
    if (cmd === 'genrsa') return { output: `Generating RSA private key, 2048 bit long modulus (2 primes)\n.......+++++\n...+++++\ne is 65537 (0x010001)\n-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA...[key data]...\n-----END RSA PRIVATE KEY-----` }
    if (cmd === 's_client') {
      const host = params.find((p, i) => params[i - 1] === '-connect') || 'example.com:443'
      return { output: `CONNECTED(00000003)\ndepth=2 C = US, O = DigiCert Inc, CN = DigiCert Global Root CA\nverify return:1\nServer certificate:\nsubject=CN = ${host.split(':')[0]}\nSSL handshake has read 5254 bytes and written 763 bytes\nProtocol  : TLSv1.3\nCipher    : TLS_AES_256_GCM_SHA384\n---\nCertificate chain\n 0 s:CN = ${host.split(':')[0]}` }
    }
    if (cmd === 'passwd') return { output: `$apr1$random$hashedstringhere12345678901` }
    return { output: `OpenSSH 3.0.2: usage: openssl command [options]` }
  }

  // ── Dev Commands ─────────────────────────────────────────────────

  private cmdGit(params: string[]): CommandResult {
    const sub = params[0] || ''
    const cmds: Record<string, string> = {
      'init': `Initialized empty Git repository in /home/${this.user}/project/.git/`,
      'status': `On branch main\nYour branch is up to date with 'origin/main'.\n\nChanges not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n\n\tmodified:   index.html\n\tmodified:   style.css\n\nUntracked files:\n  (use "git add <file>..." to include in what will be committed)\n\n\tREADME.md\n\nno changes added to commit`,
      'add': '',
      'commit': `[main 4f2e6c8] ${params.slice(2).join(' ') || 'Initial commit'}\n 2 files changed, 24 insertions(+), 3 deletions(-)\n create mode 100644 README.md`,
      'push': `Enumerating objects: 5, done.\nCounting objects: 100% (5/5), done.\nDelta compression using up to 4 threads\nCompressing objects: 100% (3/3), done.\nWriting objects: 100% (3/3), 1.23 KiB | 1.23 MiB/s, done.\nTotal 3 (delta 0), reused 0 (delta 0)\nTo https://github.com/user/repo.git\n   abc123..4f2e6c8  main -> main`,
      'pull': `remote: Enumerating objects: 5, done.\nremote: Counting objects: 100% (5/5), done.\nFrom https://github.com/user/repo\n   abc123..4f2e6c8  main -> origin/main\nUpdating abc123..4f2e6c8\nFast-forward\n README.md | 5 +++++\n 1 file changed, 5 insertions(+)`,
      'log': `commit 4f2e6c8a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6 (HEAD -> main, origin/main)\nAuthor: ${this.user} <${this.user}@unicode.edu>\nDate:   Mon Apr 17 10:00:00 2026 +0000\n\n    Initial commit\n\ncommit abc12345678\nAuthor: ${this.user} <${this.user}@unicode.edu>\nDate:   Sun Apr 16 09:00:00 2026 +0000\n\n    Setup project structure`,
      'clone': `Cloning into '${params[1]?.split('/').pop()?.replace('.git', '') || 'repo'}'...\nremote: Enumerating objects: 45, done.\nremote: Counting objects: 100% (45/45), done.\nReceiving objects: 100% (45/45), 21.23 KiB | 3.54 MiB/s, done.`,
      'branch': `-* main\n  develop\n  feature/new-ui`,
      'checkout': `Switched to branch '${params[1] || 'main'}'`,
      'diff': `diff --git a/index.html b/index.html\nindex abc123..def456 100644\n--- a/index.html\n+++ b/index.html\n@@ -1,5 +1,5 @@\n-<title>Old Title</title>\n+<title>New Title</title>`,
    }
    return { output: cmds[sub] !== undefined ? cmds[sub] : `git: '${sub}' is not a git command. See 'git --help'.` }
  }

  private cmdPython(params: string[]): CommandResult {
    if (params.length === 0 || params[0] === '-') {
      return { output: `Python 3.10.12 (main, Nov 20 2023, 15:14:05) [GCC 11.4.0] on linux\nType "help", "copyright", "credits" or "license" for more information.\n>>> (interactive mode simulated)` }
    }
    if (params[0] === '-c') {
      const code = params.slice(1).join(' ').replace(/^['"]|['"]$/g, '')
      if (code.includes('print')) {
        const match = code.match(/print\(['"](.+?)['"]\)/)
        return { output: match ? match[1] : 'Hello, World!' }
      }
    }
    return { output: `Running ${params[0]}...\nScript executed successfully.` }
  }

  private cmdNode(params: string[]): CommandResult {
    if (params.length === 0) {
      return { output: `Welcome to Node.js v18.15.0.\nType ".help" for more information.\n> (interactive mode simulated)` }
    }
    return { output: `Running ${params[0]}...\nServer started on port 3000` }
  }

  private cmdNpm(params: string[]): CommandResult {
    const sub = params[0] || ''
    if (sub === 'install' || sub === 'i') {
      const pkg = params[1] || 'packages'
      return { output: `\nadded 312 packages, and audited 313 packages in 4s\n\n83 packages are looking for funding\n  run \`npm fund\` for details\n\nfound 0 vulnerabilities` }
    }
    if (sub === 'start') return { output: `> project@1.0.0 start\n> node index.js\n\nServer running at http://localhost:3000` }
    if (sub === 'run') return { output: `> project@1.0.0 ${params[1]}\n> ${params[1] === 'build' ? 'webpack --mode production' : 'node ' + params[1]}\n\nDone in 2.34s.` }
    return { output: `npm ${sub}: command run` }
  }

  private cmdPip(params: string[]): CommandResult {
    const sub = params[0] || ''
    if (sub === 'install') {
      const pkg = params[1] || 'package'
      return { output: `Collecting ${pkg}\n  Downloading ${pkg}-1.0.0-py3-none-any.whl (45 kB)\n     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 45.3/45.3 kB 2.1 MB/s\nInstalling collected packages: ${pkg}\nSuccessfully installed ${pkg}-1.0.0` }
    }
    if (sub === 'list') {
      return { output: `Package    Version\n---------- -------\nnumpy      1.24.0\npandas     2.0.0\nrequests   2.31.0\nflask      3.0.0\nscikit-learn 1.3.0` }
    }
    return { output: `pip ${sub}: done` }
  }
}
