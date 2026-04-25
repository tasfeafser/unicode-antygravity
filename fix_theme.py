import os
import glob
import re

def replace_classes(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Replacements for dark mode to dynamic mode
    replacements = [
        (r'bg-black', r'bg-background'),
        (r'text-white', r'text-foreground'),
        (r'border-white/10', r'border-border'),
        (r'border-white/5', r'border-border'),
        (r'text-zinc-400', r'text-muted-foreground'),
        (r'text-zinc-300', r'text-muted-foreground'),
        (r'text-zinc-500', r'text-muted-foreground'),
        (r'bg-white/5', r'bg-muted'),
        (r'bg-white/10', r'bg-muted-foreground/20'),
        (r'bg-\[\#ef233c\]', r'bg-primary'),
        (r'text-\[\#ef233c\]', r'text-primary'),
        (r'border-\[\#ef233c\]', r'border-primary'),
    ]

    new_content = content
    for old, new in replacements:
        new_content = re.sub(r'\b' + old + r'\b', new, new_content)

    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

# Process all tsx files in app/
for root, _, files in os.walk('app'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            replace_classes(os.path.join(root, file))

print("Done")
