# this code renames all jpg files in '/nyc' etc folders to 1, 2, 3, ... etc .jpg

import os

base_dir = "photography_page_images"

# loop through each subfolder (nyc, pittsburgh, udaipur, etc.)
for folder in os.listdir(base_dir):
    subdir = os.path.join(base_dir, folder)
    if os.path.isdir(subdir):
        files = os.listdir(subdir)
        files.sort()  
        for i, filename in enumerate(files, start=1):
            ext = os.path.splitext(filename)[1]  
            new_name = f"{i}{ext}"
            old_path = os.path.join(subdir, filename)
            new_path = os.path.join(subdir, new_name)
            os.rename(old_path, new_path)
        print(f"Renamed files in {subdir}")