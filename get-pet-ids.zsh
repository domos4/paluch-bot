DATE=$(date)
wget -O "napaluchu_html1_$DATE" https://napaluchu.waw.pl/zwierzeta/zwierzeta-do-adopcji/\?pet_breed\=0\&pet_sex\=0\&pet_weight\=2\&pet_age\=1\&pet_date_from\=\&pet_date_to\=\&pet_name\=\&submit-form\= 
wget -O "napaluchu_html2_$DATE" https://napaluchu.waw.pl/zwierzeta/zwierzeta-do-adopcji/\?pet_breed\=0\&pet_sex\=0\&pet_weight\=2\&pet_age\=2\&pet_date_from\=\&pet_date_to\=\&pet_name\=\&submit-form\=
cat "napaluchu_html1_$DATE" | grep -Eo '<a href="/pet/(\d+)/">dowiedz' | grep -Eo '\d+' | tee "napaluchu_db1_$DATE"
cat "napaluchu_html2_$DATE" | grep -Eo '<a href="/pet/(\d+)/">dowiedz' | grep -Eo '\d+' | tee "napaluchu_db2_$DATE"
cat "napaluchu_db1_$DATE" | xargs node update-db.js --date="$(date)"
cat "napaluchu_db2_$DATE" | xargs node update-db.js --date="$(date)"
