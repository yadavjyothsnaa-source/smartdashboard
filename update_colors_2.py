import os

target_dir = "/Users/jyothsnayadav/Downloads/smartdashboard-main-3/src"

replacements = {
    "rgba(0,214,255": "rgba(22,163,74",
    'className="text-lg font-bold text-white tracking-tight leading-tight">Smart Business Analytics Dashboard': 'className="text-lg font-bold text-[#16a34a] tracking-tight leading-tight">Smart Business Analytics Dashboard',
    '>SMART BUSINESS ANALYTICS DASHBOARD': ' className="text-[#16a34a]">SMART BUSINESS ANALYTICS DASHBOARD',
    'className="text-xs text-[#16a34a] mt-1 uppercase tracking-wider font-semibold"': 'className="text-xs text-[#14532d] mt-1 uppercase tracking-wider font-bold"'
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
