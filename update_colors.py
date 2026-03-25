import os

target_dir = "/Users/jyothsnayadav/Downloads/smartdashboard-main-3/src"

replacements = {
    "#00D6FF": "#16a34a", # Light/Mid Green (Standard highlight)
    "#0050FF": "#14532d"  # Dark Green (Backgrounds, buttons)
}

for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file.endswith(".tsx") or file.endswith(".ts") or file.endswith(".css"):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            
            new_content = content
            for old, new in replacements.items():
                new_content = new_content.replace(old, new)
                new_content = new_content.replace(old.lower(), new)
            
            if new_content != content:
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
