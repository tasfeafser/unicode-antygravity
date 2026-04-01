export interface FSNode {
  name: string
  type: 'file' | 'dir'
  content?: string
  children?: Record<string, FSNode>
  permissions: string
  owner: string
  group: string
}

export const INITIAL_FILESYSTEM: FSNode = {
  name: '/',
  type: 'dir',
  permissions: 'drwxr-xr-x',
  owner: 'root',
  group: 'root',
  children: {
    'home': {
      name: 'home',
      type: 'dir',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      children: {
        'student': {
          name: 'student',
          type: 'dir',
          permissions: 'drwxr-xr-x',
          owner: 'student',
          group: 'student',
          children: {
            'readme.txt': {
              name: 'readme.txt',
              type: 'file',
              content: 'Welcome to the Unicode Linux Simulator!\nTry basic commands like ls, pwd, cat, mkdir, and touch.',
              permissions: '-rw-r--r--',
              owner: 'student',
              group: 'student'
            }
          }
        }
      }
    },
    'etc': {
      name: 'etc',
      type: 'dir',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      children: {
        'passwd': {
          name: 'passwd',
          type: 'file',
          content: 'root:x:0:0:root:/root:/bin/bash\nstudent:x:1000:1000:,,,:/home/student:/bin/bash',
          permissions: '-rw-r--r--',
          owner: 'root',
          group: 'root'
        }
      }
    },
    'var': {
      name: 'var',
      type: 'dir',
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      children: {
        'log': {
          name: 'log',
          type: 'dir',
          permissions: 'drwxr-xr-x',
          owner: 'root',
          group: 'root',
          children: {
            'syslog': {
              name: 'syslog',
              type: 'file',
              content: 'Oct 12 10:00:01 unicode systemd: Started Unicode Academic OS.',
              permissions: '-rw-r-----',
              owner: 'root',
              group: 'adm'
            }
          }
        }
      }
    }
  }
}

export class VirtualFileSystem {
  root: FSNode
  cwd: string[]

  constructor(initialState?: FSNode) {
    this.root = initialState ? JSON.parse(JSON.stringify(initialState)) : JSON.parse(JSON.stringify(INITIAL_FILESYSTEM))
    this.cwd = ['home', 'student']
  }

  // Helper to traverse to a specific path array
  private traverse(path: string[]): FSNode | null {
    let current = this.root
    for (const part of path) {
      if (part === '') continue
      if (current.type !== 'dir' || !current.children || !current.children[part]) {
        return null
      }
      current = current.children[part]
    }
    return current
  }

  // Resolve an absolute or relative path string into an array of path parts
  resolvePath(pathStr: string): string[] {
    let parts = this.cwd.slice()
    
    if (pathStr.startsWith('/')) {
      parts = []
    }

    const newParts = pathStr.split('/').filter(Boolean)
    for (const part of newParts) {
      if (part === '.') continue
      if (part === '..') {
        if (parts.length > 0) parts.pop()
      } else {
        parts.push(part)
      }
    }
    return parts
  }

  getNode(pathStr: string): FSNode | null {
    const parts = this.resolvePath(pathStr)
    return this.traverse(parts)
  }

  getPwd(): string {
    return '/' + this.cwd.join('/')
  }
}
