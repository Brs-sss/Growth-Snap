
def ListToString(tag_list):
    '''
     把tag_list 例如[a,b,c]转换为字符串格式的a,b,c  便于数据库保存
    '''
    return ",".join(tag_list)

def StringToList(tag_string):
    return tag_string.split(",")