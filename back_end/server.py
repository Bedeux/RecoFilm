# Python Flask code (server.py)

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app) 

@app.route('/predict', methods=['POST'])
def predict():
    # Recevoir les données du POST request
    data = request.json['data']
    data = transform_data(data)
    print(data)
    #data = {10862: 4.5,64439:4.5,256661:4.5,190918:3.5,143692:5.0,255238:4.5,115362:4.5,2072: 5.0, 4063: 5.0, 13892: 5.0,225953:4.0, 10568: 4.5, 11736: 5.0, 114782: 5.0, 135063: 4.5, 5969: 3.5, 21189:5.0}
    predictions = get_recommandations(data)

    print(predictions)
    return jsonify({'prediction': predictions[0][0]})


def make_prediction(data):
    # Code de prédiction ici
    # Remplacer cela par votre propre code de prédiction
    return "Prediction result"

def get_recommandations(new_user_data):

    # Créer le DataFrame
    df = pd.read_csv('./movie_grades.csv')

    # Agréger les notes des utilisateurs pour les mêmes films en utilisant la moyenne
    df = df.groupby(['Nom Utilisateur', 'ID Film']).agg({'Note': 'mean'}).reset_index()

    # Pivoter les données pour avoir une ligne par utilisateur et chaque colonne est un film avec la note correspondante
    df = df.pivot(index='Nom Utilisateur', columns='ID Film', values='Note').fillna(0)

    new_row = pd.DataFrame(new_user_data, index=['user_target'])

    df = pd.concat([df, new_row])
    df = df.fillna(0)

    similarity_matrix = cosine_similarity(df)

    similarity_matrix_df = pd.DataFrame(similarity_matrix, index=df.index, columns=df.index)

    similarity_with_target_user = similarity_matrix_df.loc['user_target'].drop('user_target')

    similar_users = similarity_with_target_user.nlargest(5)

    films_non_vus = df.loc['user_target'][df.loc['user_target'] == 0]

    recommandations = {}
    for film_id, rating in films_non_vus.items():
        if rating == 0:  # Vérifie si le film n'a pas encore été regardé par 'user_target'
            weighted_sum = 0
            sum_of_weights = 0
            count_users = 0  # Compteur pour les utilisateurs ayant vu le film
            for user_id, similarity in similar_users.items():
                if df.loc[user_id, film_id] != 0:  # Vérifie si l'utilisateur a regardé ce film
                    count_users += 1
                    weighted_sum += similarity * df.loc[user_id, film_id] # similarité du user x sa note
                    sum_of_weights += similarity
            if count_users >= 2:  # Ajoute le film comme recommandation uniquement s'il a été vu par au moins deux personnes similaires
                if sum_of_weights != 0:
                    predicted_rating = weighted_sum / sum_of_weights
                    recommandations[film_id] = predicted_rating

    # Trie les recommandations par note prédite décroissante
    recommandations = sorted(recommandations.items(), key=lambda x: x[1], reverse=True)
    return recommandations

def transform_data(input_data):
    # Initialiser un dictionnaire pour stocker les données transformées
    transformed_data = {}

    # Parcourir chaque élément du tableau JSON
    for entry in input_data:
        # Ajouter l'entrée transformée au dictionnaire avec l'identifiant du film comme clé
        transformed_data[int(entry['movie_id'])] = entry['rating']

    return transformed_data

if __name__ == '__main__':
    app.run(debug=True)
