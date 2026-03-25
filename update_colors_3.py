import os

target_dir = "/Users/jyothsnayadav/Downloads/smartdashboard-main-3/src"

replacements = {
    "#16a34a": "#166534",
    "rgba(22,163,74": "rgba(22,101,52"
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
            
            if new_content != content:
                with open(filepath, 'w') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
