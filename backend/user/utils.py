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
from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
import string
from langdetect import detect
from math import floor

import PyPDF2
import os
# os.environ['IMAGEIO_FFMPEG_EXE'] = '/Users/alex/Downloads/ffmpeg'
os.environ['IMAGEIO_FFMPEG_EXE'] = '/usr/bin/ffmpeg'
from moviepy.editor import VideoFileClip, AudioFileClip
import imageio
from PIL import Image
import requests


# 指定 wkhtmltopdf 可执行文件路径
#config = pdfkit.configuration(wkhtmltopdf='D:/Program Files/wkhtmltopdf/bin/wkhtmltopdf.exe')  #windows
config = pdfkit.configuration(wkhtmltopdf='/usr/bin/wkhtmltopdf')  # linux
# config = pdfkit.configuration(wkhtmltopdf='/usr/local/bin/wkhtmltopdf')  #mac
 
render_path = 'static/template/rendered/'

event_image_base_path = '../../ImageBase/'

fps_list = [0.55 , 0.42 , 0.72 , 0.55 , 0.57 , 0.55, 0.545 ,  0.53] # 帧率 0.55 0.44 0.72 0.55 0.55 0.55 0.545  0.53


##########################    block 1: 用于转换tags和string
def ListToString(tag_list):
    """
     把tag_list 例如[a,b,c]转换为字符串格式的a,b,c  便于数据库保存
    """
    return ",".join(tag_list)


def StringToList(tag_string):
    if tag_string == "":
        return []
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


def is_punctuation(char):
    # 判断是否是英文标点
    if char in string.punctuation:
        return True
    
    # 判断是否是中文标点
    # 中文标点的范围可以通过查阅Unicode标准来获取
    chinese_punctuation_ranges = [
        (0x3000, 0x303F),  # CJK标点符号
        (0xFF00, 0xFFEF),  # 全角ASCII、全角标点
    ]
    for start, end in chinese_punctuation_ranges:
        if start <= ord(char) <= end:
            return True
    
    return False

def split_chinese_text(c, text, font, font_size, max_width):
    lines = []
    current_line = ""
    current_width = 0

    for char in text:
        char_width = c.stringWidth(char, font, font_size)
        if char == '\n':
            current_line += char
            lines.append(current_line)
            current_line = ''
            current_width = 0
            
        elif is_punctuation(char):
            current_line += char
            current_width += char_width
            
        elif current_width + char_width > max_width:
            lines.append(current_line)
            current_line = char
            current_width = char_width
        else:
            current_line += char
            current_width += char_width

    if current_line:
        lines.append(current_line)

    return lines

def split_english_text(c, text, font, font_size, max_width):
    lines = []
    current_line = ""
    current_width = 0

    paragraphs=text.split('\n')
    for para in paragraphs:
        current_line = ""
        current_width = 0
        for word in para.split(' '):
            word_width = c.stringWidth(word, font, font_size)
            if current_width + word_width > max_width:
                lines.append(current_line)
                current_line = word
                current_width = word_width
            else:
                if current_line:
                    current_line += " "
                    current_width += c.stringWidth(" ", font, font_size)
                current_line += word
                current_width += word_width

        current_line += '\n'
        lines.append(current_line)

    return lines

#可以根据图片高度情况，将一段分成段，并保证排版出来ok
def wrap_text(text,image_height_list):
    
    # 判断语言
    if text.strip() == '':
        lang_type = 'B'
    else:
        language = detect(text)
        lang_type = 'A' if language == 'zh-cn' or language == 'ja' else 'B'

    font_size = 15.5 if lang_type == 'A' else 12
    width = 175 * mm
    height_without_title = 220 * mm
    height = 240 * mm
    line_height = 1.5
    line_height_points = 16 * line_height

    c = canvas.Canvas("output.pdf", pagesize=A4)
    c.setFont("Helvetica", font_size)
    
    if lang_type == 'A':
        text_lines = split_chinese_text(c, text, "Helvetica", font_size, width)
    else:
        text_lines = split_english_text(c, text, "Helvetica", font_size, width)
    
    total_lines=len(text_lines)
    
    #第一页 
    text_block_list=[]
    jointer='' if lang_type == 'A' else ' '
    image_height = 0 if len(image_height_list)==0 else image_height_list[0]
    page_lines_max=floor((height_without_title - image_height)/line_height_points)
    page_num=0
    while total_lines>0:
        if total_lines <= page_lines_max:
            text_block_list.append(jointer.join(text_lines))
            break
        else:
            text_block_list.append(jointer.join(text_lines[:page_lines_max]))
            total_lines-=page_lines_max
            text_lines=text_lines[page_lines_max:]
            
            #更新page_lines_max
            page_num+=1
            image_height= 0 if page_num>=len(image_height_list) else image_height_list[page_num]
            page_lines_max=floor((height - image_height)/line_height_points)
            
    
    return text_block_list   

def get_image_aspect_ratio(image_path):
    try:
        with Image.open(image_path) as img:
            width, height = img.size
            aspect_ratio = height / width
            return aspect_ratio
    except Exception as e:
        print(f"Error: {e}")
        return None
    
def arrange_page(text,image_height_list,image_path_list):
    text_blocks=wrap_text(text,image_height_list)
    pages=[]
    image_num=len(image_path_list)

    for i in range(0,len(text_blocks)):
        page={}
        page['text']=text_blocks[i]
        page['image']=None if i>=image_num else image_path_list[i]
        page['template']='page.html'
        page['is_first']=(i==0)
        pages.append(page)
    
    return pages

            


        


##########################    block 3: 生成diary pdf
diary_options = {
        'page-size': 'A4',
        'margin-top': '0mm',
        'margin-right': '0mm',
        'margin-bottom': '0mm',
        'margin-left': '0mm',
        'encoding': 'utf-8',
        "enable-local-file-access":True,
        "disable-smart-shrinking":True,    #终于好了，该死的wkhtmltopdf，愚蠢至极。
        'dpi': 96,
    }

covers_path='../covers/'  #注意，似乎只能用relative路径（相对于渲染出来的html）
papers_path='../papers/'
current_directory = os.path.dirname(os.path.abspath(__file__))

def GenerateDiaryPDF(event_list, cover_idx, paper_idx, output_path="diary.pdf"):
    rendered_files=[]
    
    #absolute_path_cover = quote(os.path.join(current_directory, covers_path+f'cover_{cover_idx}.png'), safe="")

    cover=render_template('static/template/htmls/cover.html',
                          {
                              'background_img':covers_path+f'cover_{cover_idx}.png',
                              'title':'Welcome to My Diary',
                              'date':'2023年11月12日'
                            })
    rendered_files.append(cover)
    
    color_set={}
    paper_idx_num=int(paper_idx)  
    color_set['text_color'] ="#000"
    color_set['title_color'] ="#000d6d"
    color_set['date_color'] ="#666"

    if paper_idx_num>=4 and paper_idx_num<8:  #dark style 
        color_set['text_color'] ="#fff"
        color_set['title_color'] ="#ff9d00"
        color_set['date_color'] ="#ddd"
    
    
    for event in event_list:
        text = event['content']
        imgHeightList=[]
        imgPathList=[]
        if event['type']=='event':
            for img in event['imgList']:
                img_path = event_image_base_path+event['event_id']+'/'+img
                imgPathList.append(img_path)
                img_height=get_image_aspect_ratio(image_path= './static/ImageBase/' +event['event_id']+'/'+img)*100 #100mm是宽度
                imgHeightList.append(img_height)

        
        pages=arrange_page(text,imgHeightList,imgPathList)
        template_path='static/template/htmls/'
        for abs_page in pages:
            page=render_template(template_html=(template_path+abs_page['template']),
                                 context_dict={
                                     'background_img':papers_path+f'paper_{paper_idx}.png',
                                     'title':event['title'],
                                     'text':abs_page['text'],
                                     'date':event['date'],
                                     'image':abs_page['image'],
                                     'color_set':color_set,
                                     'show_title':abs_page['is_first'],
                                     'show_image':(abs_page['image']!=None)
                                     })
            rendered_files.append(page)

    #  将多个 HTML 文件合并为一个 PDF
    pdfkit.from_file(rendered_files, output_path=output_path, options=diary_options)
    
    for file in rendered_files:
        os.remove(file)
    
    print(f"Diary PDF generated at: {output_path}")
    
###########################    end block 3

def GenerateEventThumnail(src_path, dest_path, image_name, target_width=400):
    try:
        # 打开图像文件
        if not os.path.exists(dest_path):
             os.makedirs(dest_path)
             
        with Image.open(src_path) as img:
            # 调整大小并保存缩略图
            img = img.convert('RGB')
            width, height = img.size
            if target_width<width:
                aspect_ratio = height / width
                img_resized = img.resize((target_width,floor(target_width*aspect_ratio)))
            else: 
                img_resized=img
            img_resized.save(dest_path+image_name, "JPEG")  # 可根据需要选择图像格式
            print("Thumbnail created successfully.")
    except Exception as e:
        print(f"Error creating thumbnail: {e}")


##########################    block 4: pdf转图片，用到pdf2image，依赖poppler

def GenerateThumbnail(pdf_path, output_folder,max_page=5, resolution=100):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    images = convert_from_path(pdf_path,first_page=1,last_page=max_page, dpi=resolution) #如果总页数小于max_page，会自动处理
    print(images.__len__())
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        page_count = len(pdf_reader.pages)
    
    for i, image in enumerate(images):
        print(f"Generating thumbnail for page {i+1}...")
        thumbnail_path = f"{output_folder}/thumbnail_page_{i + 1}.jpg"
        image.save(thumbnail_path, 'JPEG')
    
    return len(images),page_count

###########################    end block 4

##########################    block 5: pdf（8页以内）转长图，用到pdf2image，依赖poppler

def GenerateLongImage(pdf_path, output_path,resolution=100):
    images = convert_from_path(pdf_path, dpi=resolution) #如果总页数小于max_page，会自动处理
    width, height = images[0].size
    result = Image.new('RGB', (width, height * len(images)))
    for i, img in enumerate(images):
        result.paste(img, (0, i * height))
    result.save(output_path)
###########################    end block 5
   


# 生成视频第一步：统一大小
def resizeVideoImage(image_path_list, video_title, label):
    print(image_path_list)
    resized_image_path_list = []
    resized_image_path = 'static/video/resized/'
    if not os.path.exists(resized_image_path):
        os.makedirs(resized_image_path)
    # 生成title
    black = cv2.imread('static/video/black.png')
    black = cv2.resize(black, (1080, 608), interpolation=cv2.INTER_CUBIC)
    cv2.imwrite('static/video/black.png', black)
    black = Image.open('static/video/black.png')
    # resize
    black = black.resize((1080, 608))
    font_title = ImageFont.truetype('Ye.ttf', 50, encoding='utf-8')
    font_label = ImageFont.truetype('Ye.ttf', 30, encoding='utf-8')
    draw = ImageDraw.Draw(black)
    draw.text((100, 100), video_title[:-1], fill=(255, 255, 255), font=font_title)
    draw.text((100, 175), label, fill=(255, 255, 255), font=font_label)
    date = datetime.now().strftime('%Y-%m-%d')
    draw.text((100, 200), date, fill=(255, 255, 255), font=font_label)
    black.save('static/video/resized/title.png')
    resized_image_path_list.append('static/video/resized/title.png')
    
    
    
    # date = datetime.now().strftime('%Y-%m-%d')

    # cv2.putText(black, video_title, (100, 100), cv2.FONT_HERSHEY_COMPLEX_SMALL, 2, (255, 255, 255), 1)
    # black = cv2.putText(black, label, (100, 150), cv2.FONT_HERSHEY_COMPLEX_SMALL, 1, (255, 255, 255), 1)
    # black = cv2.putText(black, date, (100, 200), cv2.FONT_HERSHEY_COMPLEX_SMALL, 1, (255, 255, 255), 1)
    # cv2.imwrite('static/video/resized/title.png', black)
    # resized_image_path_list.append('static/video/resized/title.png')
    i = 0
    for image_path in image_path_list:
        img = cv2.imread(image_path)
        
        height, width = img.shape[:2]
        target_width = 1080
        target_height = int((target_width / width) * height)
        if target_height >= 608:
            img = cv2.resize(img, (1080, target_height), interpolation=cv2.INTER_CUBIC)
            middle = int(target_height/2)
            img = img[middle-304:middle+304, :, :]
        else:
            target_height = 608
            target_width = int((target_height / height) * width)
            img = cv2.resize(img, (target_width, 608), interpolation=cv2.INTER_CUBIC)
            middle = int(target_width/2)
            img = img[:, middle-540:middle+540, :]
        # img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, (1080, 608), interpolation=cv2.INTER_CUBIC)
        print(img.shape)
        out_path = os.path.join(resized_image_path, str(i) + '.png')
        cv2.imwrite(out_path, img)
        resized_image_path_list.append(out_path)
        i += 1
    return resized_image_path_list


def GenerateVideo(image_path_list, audio_index, video_title, label, openid):
    resized_image_path_list = resizeVideoImage(image_path_list, video_title, label)
    print(resized_image_path_list)
    # # 合成视频
    user_dir = f'static/video/{openid}'
    if not os.path.exists(user_dir):
        os.makedirs(user_dir)
    video_dir = f'static/video/{openid}/temp.mp4'      # 输出视频的保存路径
    print(f'video_dir: {video_dir}')
    print(f'audio_index: {audio_index}')
    print(f'fps: {fps_list[int(audio_index)]}')
    fps = fps_list[int(audio_index)]    # 帧率 0.55 0.44 0.72 0.55 0.55 0.55 0.545  0.53
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
    video = VideoFileClip(video_dir)
    # video = VideoFileClip('static/video/temp.mp4')
    duration = video.duration  # 视频时长
    videos = video.set_audio(AudioFileClip(f'static/audio/audio_{audio_index}.mp3').subclip(0, duration))  # 音频文件
    videos.write_videofile(f'static/video/{openid}/{video_title}.mp4', audio_codec='aac')  # 保存合成视频，注意加上参数audio_codec='aac'，否则音频无声音/
    # 删除resized文件夹
    shutil.rmtree('static/video/resized')
    # 删除temp.mp4
    os.remove(video_dir)
    # video.reader.close()
    # video.audio.reader.close_proc()
    # return video_title

# 对profile进行压缩，取中间的部分
def GenerateProfileThumnail(src_path, dest_path, image_name, target_width=400):
    try:
        # 打开图像文件
        if not os.path.exists(dest_path):
             os.makedirs(dest_path)
             
        with Image.open(src_path) as img:
            # 调整大小并保存缩略图
            img = img.convert('RGB')
            width, height = img.size
            print(f'width: {width}, height: {height}')
            # 先取正方形
            if width > height:
                img = img.crop((int((width - height) / 2), 0, int((width + height) / 2), height))
            else:
                img = img.crop((0, int((height - width) / 2), width, int((height + width) / 2)))
            img_resized = img.resize((target_width, target_width))
            img_resized.save(dest_path+image_name, "JPEG")
            print("Profile Thumbnail created successfully.")
    except Exception as e:
        print(f"Error creating thumbnail: {e}")



