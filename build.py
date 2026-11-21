#!/usr/bin/env python3
"""Skleja src/ w jeden plik web/index.html."""
import os
ROOT = os.path.dirname(os.path.abspath(__file__))
ORDER = ['core', 'data', 'gfx', 'arena', 'mapgen', 'audio', 'input', 'ui', 'party', 'battle', 'world', 'menus', 'main']
shell = open(os.path.join(ROOT, 'src', 'shell.html'), encoding='utf-8').read()
parts = []
for n in ORDER:
    p = os.path.join(ROOT, 'src', n + '.js')
    parts.append('// ======== ' + n + '.js ========\n' + open(p, encoding='utf-8').read())
js = '\n'.join(parts).replace('</script>', '<\\/script>')
os.makedirs(os.path.join(ROOT, 'web'), exist_ok=True)
open(os.path.join(ROOT, 'web', 'index.html'), 'w', encoding='utf-8').write(shell.replace('/*__JS__*/', js))
print('web/index.html', len(js), 'bytes of JS')
