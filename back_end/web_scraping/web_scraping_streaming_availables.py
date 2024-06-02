import requests
from bs4 import BeautifulSoup
import json
import time


def get_id_from_div_class(div_class):
    for class_str in div_class:
        if 'data-entity-id=' in class_str:
            id_part = class_str.split('data-entity-id=')[-1]
            movie_id = id_part.split('&')[0]
            break

    return movie_id


def get_url(provider,movie_id):
    match provider:
        case 'Netflix':
            return "https://www.allocine.fr/jump/#data-affiliation-type=svod&data-provider=netflix&data-entity-type=Movie&data-entity-id="+str(movie_id)
        case 'Amazon Prime Video':
            return "https://www.allocine.fr/jump/#data-affiliation-type=svod&data-provider=amazon&data-entity-type=Movie&data-entity-id="+str(movie_id)
        case 'Disney+':
            return "https://www.allocine.fr/jump/#data-affiliation-type=svod&data-provider=disney&data-entity-type=Movie&data-entity-id="+str(movie_id)
    return None



with open('./movies_data.json', 'r') as f:
    movies_data = json.load(f)

movie_ids = []

for film_id in movies_data:
    movie_ids.append(film_id)


movies_data = {}



for movie_id in movie_ids:

    url = 'https://www.allocine.fr/film/fichefilm_gen_cfilm='+str(movie_id)+'.html'
    print(url)
    response = requests.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')

        spans = soup.find_all('span', attrs={'aria-label': lambda x: x and x.startswith("Voir maintenant sur")})

        netflix_url = None
        prime_video_url = None
        disney_url = None  
        for span in spans:
            # print(span)
            provider = span.get('aria-label', '').replace("Voir maintenant sur ", "")

            movie_id = get_id_from_div_class(span.get("class",''))
        
            if provider == 'Netflix':
                netflix_url = get_url(provider,movie_id)
            if provider == 'Amazon Prime Video':
                prime_video_url = get_url(provider,movie_id)
            if provider == 'Disney+':
                disney_url = get_url(provider,movie_id)

            movies_data[movie_id] = {
                "netflix_url": netflix_url,
                "prime_video_url": prime_video_url,
                "disney_url": disney_url
            }
            print(movies_data[movie_id])
    time.sleep(1.4)

with open('movies_streaming.json', 'w') as f:
    json.dump(movies_data, f, indent=4)