DATE=$(date)
wget -O "napaluchu1.html $DATE" https://napaluchu.waw.pl/zwierzeta/zwierzeta-do-adopcji/\?pet_breed\=0\&pet_sex\=0\&pet_weight\=2\&pet_age\=1\&pet_date_from\=\&pet_date_to\=\&pet_name\=\&submit-form\= 
wget -O "napaluchu2.html $DATE" https://napaluchu.waw.pl/zwierzeta/zwierzeta-do-adopcji/\?pet_breed\=0\&pet_sex\=0\&pet_weight\=2\&pet_age\=2\&pet_date_from\=\&pet_date_to\=\&pet_name\=\&submit-form\=
cat "napaluchu1.html $DATE" | grep -Eo '<a href="/pet/(\d+)/">dowiedz' | grep -Eo '\d+' | tee "napaluchu1.db $DATE"
cat "napaluchu2.html $DATE" | grep -Eo '<a href="/pet/(\d+)/">dowiedz' | grep -Eo '\d+' | tee "napaluchu2.db $DATE"
cat "napaluchu1.db $DATE" | xargs deno run --allow-read --allow-write update-db.ts
cat "napaluchu2.db $DATE" | xargs deno run --allow-read --allow-write update-db.ts