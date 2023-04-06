import React, { useState, useEffect } from 'react';
import './Home.css'
import {
  IonPage,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonMenuButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonModal
} from '@ionic/react';

interface Pokemon {
    name: string;
}

interface PokemonDetails {
    name: string;
    description: string;
}

const Home: React.FC = () => {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails>({ name: "", description: "" });
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchPokemons = async () => {
            const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10");
            const data = await response.json();
            setPokemons(data.results);
        };
        fetchPokemons();
    }, []);

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            if (selectedPokemon.name !== "") {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${selectedPokemon.name}`);
                const data = await response.json();
                const desc = data.flavor_text_entries.find((entry: any) => entry.language.name === "en");
                setSelectedPokemon(prev => ({ ...prev, description: desc.flavor_text }));
            }
        };
        fetchPokemonDetails();
    }, [selectedPokemon]);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle class="ion-text-center" id="title">
                        Pokemon
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonGrid>
                    <IonRow>
                        {pokemons.map((pokemon) => (
                            <IonCol size="6" key={pokemon.name}>
                                <IonCard>
                                    <img
                                        id='pokeimg'
                                        alt={pokemon.name}
                                        src={`https://img.pokemondb.net/artwork/${pokemon.name}.jpg`}
                                    />
                                    <IonCardHeader>
                                        <IonCardTitle>{pokemon.name}</IonCardTitle>
                                    </IonCardHeader>
                                    <IonButton expand="block" onClick={() => {
                                        setSelectedPokemon({ name: pokemon.name, description: "" });
                                        setIsOpen(true);
                                    }}>
                                        Detail
                                    </IonButton>
                                </IonCard>
                            </IonCol>
                        ))}
                    </IonRow>
                </IonGrid>
                <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>{selectedPokemon.name}</IonTitle>
                            <IonButtons slot="end">
                                <IonButtons id="modalclosebtn" 
                                onClick={() => setIsOpen(false)}>Close</IonButtons>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <img
                            src={`https://img.pokemondb.net/artwork/${selectedPokemon.name}.jpg`}
                            alt={selectedPokemon.name}
                            id="pokemodalimg"
                        />
                        {selectedPokemon.description !== "" ? (
                            <p>{selectedPokemon.description}</p>
                        ) : (
                                <p>Loading...</p>
                            )}
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default Home;
