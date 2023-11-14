import pdfkit
from datetime import datetime
from jinja2 import Template
import random
from urllib.parse import quote
import cv2
import numpy as np
import shutil
# from mutagen.mp3 import MP3
from pdf2image import convert_from_path
import os
os.environ['IMAGEIO_FFMPEG_EXE'] = '/Users/alex/Downloads/ffmpeg'
from moviepy.editor import VideoFileClip, AudioFileClip
import imageio
from PIL import Image

# 指定 wkhtmltopdf 可执行文件路径
config = pdfkit.configuration(wkhtmltopdf='/usr/local/bin/wkhtmltopdf')

render_path = 'static/template/rendered/'

event_image_base_path = '../../ImageBase/'


##########################    block 1: 用于转换tags和string
def ListToString(tag_list):
    """
     把tag_list 例如[a,b,c]转换为字符串格式的a,b,c  便于数据库保存
    """
    return ",".join(tag_list)


def StringToList(tag_string):
    return tag_string.split(",")
###########################    end block 1


##########################    block 2: 把带{{ }}的html模版用Jinja2渲染成填了空的html

def render_template(template_html,context_dict):
    with open(template_html, "r", encoding="utf-8") as file:
        template_str = file.read()
    template = Template(template_str)
    rendered_html = template.render(context_dict)
    output_path=render_path+f'render_{random.randint(1, 10000)}.html'
    with open(output_path, 'w', encoding='utf-8') as file:
        file.write(rendered_html)
    return output_path
    
###########################    end block 2    
        


##########################    block 3: 生成diary pdf
diary_options = {
        'page-size': 'A4',
        'margin-top': '0mm',
        'margin-right': '0mm',
        'margin-bottom': '0mm',
        'margin-left': '0mm',
        'encoding': 'utf-8',
        "enable-local-file-access":True,
        "disable-smart-shrinking":True,   #终于好了，该死的wkhtmltopdf，愚蠢至极。
        'dpi': 96,
    }

covers_path='../covers/'  #注意，似乎只能用relative路径（相对于渲染出来的html）
papers_path='../papers/'
current_directory = os.path.dirname(os.path.abspath(__file__))

def GenerateDiaryPDF(event_list, cover_idx, paper_idx, output_path="diary.pdf"):
    rendered_files=[]
    
    #absolute_path_cover = quote(os.path.join(current_directory, covers_path+f'cover_{cover_idx}.png'), safe="")

    cover=render_template('static/template/htmls/cover.html',{'background_img':covers_path+f'cover_{cover_idx}.png','title':'Welcome to My Diary','date':'2023年11月12日'})
    rendered_files.append(cover)
    
    for event in event_list:
        if event['type']=='event':
            page=render_template('static/template/htmls/page.html',{'background_img':papers_path+f'paper_{paper_idx}.png','title':event['title'],'text':event['content'],'date':event['date'],'image':event_image_base_path+event['event_id']+'/'+event['imgList'][0]})
        else:
            page=render_template('static/template/htmls/page.html',{'background_img':papers_path+f'paper_{paper_idx}.png','title':event['title'],'text':event['content'],'date':event['date']})
        rendered_files.append(page)

    #  将多个 HTML 文件合并为一个 PDF
    pdfkit.from_file(rendered_files, output_path=output_path, options=diary_options)
    
    for file in rendered_files:
        os.remove(file)
    
    print(f"Diary PDF generated at: {output_path}")
    
###########################    end block 3


##########################    block 4: pdf转图片，用到pdf2image，依赖poppler

def GenerateThumbnail(pdf_path, output_folder,max_page=5, resolution=100):
    images = convert_from_path(pdf_path,first_page=1,last_page=max_page, dpi=resolution) #如果总页数小于max_page，会自动处理
    for i, image in enumerate(images):
        thumbnail_path = f"{output_folder}/thumbnail_page_{i + 1}.jpg"
        image.save(thumbnail_path, 'JPEG')
    
    return len(images)



   


# 生成视频第一步：统一大小
def resizeVideoImage(image_path_list):
    print(image_path_list)
    resized_image_path_list = []
    resized_image_path = 'static/video/resized/'
    if not os.path.exists(resized_image_path):
        os.makedirs(resized_image_path)
    black = cv2.imread('static/video/black.png')
    # 1024：768 = 640：480
    black = cv2.resize(black, (1024, 768), interpolation=cv2.INTER_CUBIC)
    title = 'A Short Video Of GouGou'
    author = 'MAMA'
    date = datetime.now().strftime('%Y-%m-%d')

    cv2.putText(black, title, (100, 100), cv2.FONT_HERSHEY_COMPLEX_SMALL, 2, (255, 255, 255), 1)
    black = cv2.putText(black, author, (100, 150), cv2.FONT_HERSHEY_COMPLEX_SMALL, 1, (255, 255, 255), 1)
    black = cv2.putText(black, date, (100, 200), cv2.FONT_HERSHEY_COMPLEX_SMALL, 1, (255, 255, 255), 1)
    cv2.imwrite('static/video/resized/title.png', black)
    resized_image_path_list.append('static/video/resized/title.png')
    i = 0
    for image_path in image_path_list:
        img = cv2.imread(image_path)
        
        height, width = img.shape[:2]
        target_width = 1024
        target_height = int((target_width / width) * height)
        if target_height >= 768:
            img = cv2.resize(img, (1024, target_height), interpolation=cv2.INTER_CUBIC)
            middle = int(target_height/2)
            img = img[middle-384:middle+384, :, :]
        else:
            target_height = 768
            target_width = int((target_height / height) * width)
            img = cv2.resize(img, (target_width, 768), interpolation=cv2.INTER_CUBIC)
            middle = int(target_width/2)
            img = img[:, middle-512:middle+512, :]
        # img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, (1024, 768), interpolation=cv2.INTER_CUBIC)
        print(img.shape)
        out_path = os.path.join(resized_image_path, str(i) + '.png')
        cv2.imwrite(out_path, img)
        resized_image_path_list.append(out_path)
        i += 1
    return resized_image_path_list


def GenerateVideo(image_path_list):
    resized_image_path_list = resizeVideoImage(image_path_list)
    print(resized_image_path_list)
    # # 合成视频
    video_dir = 'static/video/temp.mp4'      # 输出视频的保存路径
    fps = 0.5     # 帧率
    # img_size = (640, 480)      # 图片尺寸
    # fourcc = cv2.VideoWriter_fourcc('M', 'P', '4', 'V')
    # videoWriter = cv2.VideoWriter(video_dir, fourcc, fps, img_size)
    # for img_path in image_path_list:
    #     frame = cv2.imread(img_path, cv2.IMREAD_UNCHANGED)
    #     frame = cv2.resize(frame, img_size)  # 生成视频   图片尺寸和设定尺寸相同
    #     videoWriter.write(frame)  # 将图片写进视频里
    #     print(img_path)
    # videoWriter.release()  # 释放资源


    with imageio.get_writer(video_dir, fps=fps) as video:
        for image_path in resized_image_path_list:
            image = Image.open(image_path)
            image = np.array(image)
            # frame = image.convert('RGB')
            video.append_data(image)

    # 加入音频
    # video = VideoFileClip(video_dir)
    video = VideoFileClip('static/video/temp.mp4')
    duration = video.duration  # 视频时长
    videos = video.set_audio(AudioFileClip('static/video/audio/黑桃A.mp3').subclip(0, duration))  # 音频文件
    videos.write_videofile('static/video/result.mp4', audio_codec='aac')  # 保存合成视频，注意加上参数audio_codec='aac'，否则音频无声音/
    # 删除resized文件夹
    shutil.rmtree('static/video/resized')
    # 删除temp.mp4
    os.remove('static/video/temp.mp4')
    # video.reader.close()
    # video.audio.reader.close_proc()






