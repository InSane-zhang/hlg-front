#!/bin/sh

baseDir=/service/dev/abing/promo/www/js/hlg/v3
echo $baseDir

name="Mmonitor"

time="20130510"

#read -p "��������Ҫ���������ģ������ : " name   
#echo $name
#if [ ! -n "$name" ]; then  
#	echo "ģ�����Ʋ��ܿ�"
#	exit
#fi  

#read -p "�����뷢��Ŀ¼��ʽ20130202 : " time 
#echo $time
#if [ ! -n "$time" ]; then  
#	echo "�����뷢��Ŀ¼��ʽ"
#	exit
#fi 


for mode in `ls ${baseDir}/${name}`; do
    if [ ${mode} != "1.0" ]; then  
    	echo "delete ${mode}"
    	rm -rf ${baseDir}/${name}/${mode}
	fi  
done

cd /service/dev/abing/promo/www/js/hlg/v3


ki build ${name}/1.0 -t ${time}

echo "���"



