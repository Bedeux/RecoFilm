import requests
from bs4 import BeautifulSoup
import time
import requests
from bs4 import BeautifulSoup
import json
import time

films_data = {}

for page in range(1, 6):
    url = f'https://www.allocine.fr/film/meilleurs/?page={page}'
    response = requests.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        films = soup.find_all('li', class_='mdl')

        for film in films:
            film_link = film.find('a', class_='meta-title-link')
            if film_link:
                film_id = film_link['href'].split('cfilm=')[-1].split('.html')[0]
                title = film_link.text.strip()

                director_section = film.find('div', class_='meta-body-item meta-body-direction')
                director = "N/A"
                if director_section:
                    director_link = director_section.find('span', class_='dark-grey-link')
                    if director_link:
                        director = director_link.text.strip()

                films_data[film_id] = {
                    'title': title,
                    'director': director
                }

        time.sleep(0.5)

    else:
        print(f"Échec de la requête: {response.status_code}")


with open('movies_data.json', 'w', encoding='utf-8') as json_file:
    json.dump(films_data, json_file, ensure_ascii=False, indent=4)