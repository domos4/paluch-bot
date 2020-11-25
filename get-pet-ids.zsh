DATE=$(date)
DIR_PATH="./data/$DATE/"
mkdir $DIR_PATH
wget -O "${DIR_PATH}index_1.html" https://napaluchu.waw.pl/zwierzeta/zwierzeta-do-adopcji/\?pet_breed\=0\&pet_sex\=0\&pet_weight\=2\&pet_age\=1\&pet_date_from\=\&pet_date_to\=\&pet_name\=\&submit-form\=
wget -O "${DIR_PATH}index_2.html" https://napaluchu.waw.pl/zwierzeta/zwierzeta-do-adopcji/\?pet_breed\=0\&pet_sex\=0\&pet_weight\=2\&pet_age\=2\&pet_date_from\=\&pet_date_to\=\&pet_name\=\&submit-form\=
cat "${DIR_PATH}index_1.html" | grep -Eo '<a href="/pet/(\d+)/">dowiedz' | grep -Eo '\d+' | tee "${DIR_PATH}db_1"
cat "${DIR_PATH}index_2.html" | grep -Eo '<a href="/pet/(\d+)/">dowiedz' | grep -Eo '\d+' | tee "${DIR_PATH}db_2"
cat "${DIR_PATH}db_1" | xargs node update-db.js --date="$DATE" --dataPath="$DIR_PATH"
cat "${DIR_PATH}db_2" | xargs node update-db.js --date="$DATE" --dataPath="$DIR_PATH"
