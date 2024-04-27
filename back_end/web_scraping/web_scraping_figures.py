from bs4 import BeautifulSoup
import csv

def extract_user_ratings(html_content):
    soup = BeautifulSoup(html_content, "html.parser")

    critiques_utilisateurs = soup.find_all("figure", class_="qzScDZg7Q2VkqVe9ATQt cf hred")
    
    id_film_precedent = None
    note_precedente = None
    users_data = []

    for critique in critiques_utilisateurs:

        nom_utilisateur_element = critique.find("span", class_="PaPzb7STBV1hoPYo9SE8")
        if nom_utilisateur_element:
            nom_utilisateur = critique.find("span", class_="PaPzb7STBV1hoPYo9SE8").text.strip()
            
            lien_utilisateur = critique.find('a', class_='WDoum7Og6dJ3jzEd8rkO')

            id_utilisateur = lien_utilisateur["href"].split("-")[-1].rstrip("/")

            notes = critique.find_all("div", class_="rating-star tooltip-parent active")
            note_utilisateur = len(notes) * 0.5  # Chaque note active vaut 0.5

            # Extraire l'ID du film
            lien_critique = critique.select_one("figcaption a.IhUDQ7hUPWJfdFPGmG_k")
            if lien_critique:
                url_critique = lien_critique["href"]
                id_film = url_critique.split("-")[-1].rstrip('/')
                id_film_precedent = id_film
                note_precedente = note_utilisateur
            else:
                if note_precedente >= note_utilisateur:
                # Si pas de critique, utiliser l'ID du film précédent
                    id_film = id_film_precedent
                else :
                    id_film = None

            # Ajouter les données de l'utilisateur à la liste
            if id_film is not None : 
                users_data.append((id_utilisateur, note_utilisateur, id_film))
    return users_data




def write_to_csv(users_data, output_file):
    # Écrire les données dans un fichier CSV
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        # Écrire l'en-tête du fichier CSV
        writer.writerow(['Nom Utilisateur', 'Note', 'ID Film'])
        # Écrire chaque ligne d'utilisateur dans le fichier CSV
        writer.writerows(users_data)

def main(input_file, output_file):
    # Lire le contenu HTML du fichier d'entrée
    with open(input_file, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Extraire les données des utilisateurs à partir du HTML
    users_data = extract_user_ratings(html_content)

    # Écrire les données dans un fichier CSV
    write_to_csv(users_data, output_file)

if __name__ == "__main__":
    input_file = "input_html.txt"
    output_file = "movie_grades.csv"
    main(input_file, output_file)