import os
from datetime import datetime, timedelta
import time

def clean_folder(folder_path, hours):
    
    def is_folder_empty(folder_path):
    # 使用 os.listdir 获取文件夹中的所有文件和子文件夹
        contents = os.listdir(folder_path)

        # 判断文件夹是否为空
        if not contents:
            return True
        else:
            return False
        
    print('in --------------')
    # 获取当前时间
    current_time = datetime.now()

    # 计算过期时间
    expiration_time = current_time - timedelta(hours=hours)

    # 循环遍历文件夹及其子文件夹
    
    for root, dirs, files in os.walk(folder_path):
        print(root, dirs, files)
        for file in files:
            file_path = os.path.join(root, file)

            # 获取文件的创建时间
            creation_time = datetime.fromtimestamp(os.path.getctime(file_path))

            # 如果文件创建时间早于过期时间，删除文件
            if creation_time < expiration_time:
                os.remove(file_path)

        for dir in dirs:
            if is_folder_empty(root+'/'+dir):
                os.rmdir(root+'/'+dir)
        
        

if __name__ == "__main__":
    # 指定要清理的文件夹路径
    folders_needs_cleaning=["static/diary","static/video"]

    # 指定过期小时数
    expiration_hours = 2

    # 循环运行，每隔15分钟执行一次清理操作
    while True:
        for folder_path in folders_needs_cleaning:
            clean_folder(folder_path, expiration_hours)

        # 等待15分钟
        time.sleep(900)
