from django.core.exceptions import ValidationError

def file_size(value):
    filesize = value.size
    if filesize > 200000000:
        raise ValidationError("File is too large The maximum file size is 200 mb.")