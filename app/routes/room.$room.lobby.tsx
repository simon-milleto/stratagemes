import { useState } from 'react';
import { Link, json, useNavigate, useParams } from "@remix-run/react";
import { usePartySocket } from "partysocket/react";
import { useSocketConfig } from "~/context/SocketContext";
import type { LoaderFunctionArgs } from 'partymix';
import { PiCastleTurretDuotone } from "react-icons/pi";

import * as Slider from '@radix-ui/react-slider';

import { getSession, commitSession } from '~/services/sessions';
import type { GameState } from 'messages';
import {  GAME_STATUS } from '~/game/constants';
import { styled } from 'styled-system/jsx';
import { css } from 'styled-system/css';
import { TextHeading } from '~/components/TextHeading';
import { useToast } from '~/hooks/useToast';
import { Button } from '~/components/Button';
import { useDialog } from '~/hooks/useDialog';
import { useUser } from '~/context/UserContext';

export async function loader({ request, params }: LoaderFunctionArgs) {
    const session = await getSession(
        request.headers.get("Cookie")
    );

    if (params.room) {
        session.set("lastRoomId", params.room);
    }

    return json({}, {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
}

const Section = styled('section', {
    base: {
        position: 'relative',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        gap: '1rem',
        padding: '1rem',
        minW: '90%',
        maxW: '1000px'
    }
});

const HomeLink = styled(Link, {
    base: {
        position: 'absolute',
        top: '2rem',
        left: '2rem',
        fontSize: '1.5rem',
        color: 'main',
        transition: 'all 0.3s ease-in-out',

        '&:hover': {
            color: 'main/80',
            transform: 'scale(1.1)',
        },
    }
});

const _baseSection = styled('div', {
    base: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid',
        borderColor: 'main',
        padding: '1rem 0.5rem',
    }
});

const SettingsSection = styled(_baseSection, {
    base: {
        gap: '1rem',
        minH: '400px',
        justifyContent: 'space-between',
    }
});

const SettingsHeading = styled(TextHeading, {
    base: {
        fontSize: 'lg',
        marginBottom: '0.5rem',
    }
});

const SettingsForm = styled('form', {
    base: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
    }
});

const InputContainer = styled('div', {
    base: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
    }
});

const Label = styled('label', {
    base: {
        marginBottom: '0.5rem',
    }
});


const Root = styled(Slider.Root,  {
    base: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        userSelect: 'none',
        touchAction: 'none',
        width: '200px',
        height: '20px',
    }
});

const Track = styled(Slider.Track,  {
    base: {
        backgroundColor: 'black',
        position: 'relative',
        flexGrow: 1,
        borderRadius: '9999px',
        height: '3px',
    }
});

const Range = styled(Slider.Range,  {
    base: {
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: '9999px',
        height: '100%',
}
    
});

const Thumb = styled(Slider.Thumb,  {
    base: {
        display: 'block',
        width: '20px',
        height: '20px',
        backgroundColor: 'white',
        boxShadow: '0 2px 10px black',
        borderRadius: '10px',

        '&:hover': {
            backgroundColor: 'main',
        },
        '&:focus': {
            outline: 'none',
            boxShadow: '0 0 0 5px black',
        },
    }
});

const ActionButtons = styled('div', {
    base: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
    }
});

const PlayersSection = styled(_baseSection, {
    base: {
        gap: '1rem',
    }
});

const PlayerHeading = styled(TextHeading, {
    base: {
        fontSize: 'lg',
        marginBottom: '0.5rem',
    }
});

const ListPlayers = styled('ul', {
    base: {
        listStyle: 'none',
        padding: 0,
    }
});

const PlayerItem = styled('li', {
    base: {
        marginBottom: '0.5rem',
        fontWeight: 'bold',
    }
});

export default function GameLobby() {
    const { username, userId } = useUser();

    const navigate = useNavigate();
    const toast = useToast();
    const dialog = useDialog();

    const { room } = useParams<{ room: string }>();
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [maxPlayers, setMaxPlayers] = useState([4]);

    const { host } = useSocketConfig();

    const socketParty = usePartySocket({
        host,
        party: "game",
        room,
        query: { username, userId },
        onMessage(evt) {
            const data = JSON.parse(evt.data) as GameState;
            setGameState(data);

            if (data.status === GAME_STATUS.PLAYING) {
                navigate(`/room/${data.id}`);
            }
        },
    });

    
    if (!gameState) return <div>Loading...</div>;

    const shareLink = `${window.location.origin}/?code=${gameState.id}`;
    const currentPlayer = gameState.players.find(player => player.id === userId);

    const handleCopyShareLink = () => {
        navigator.clipboard.writeText(shareLink);
        toast({ title: "Lien copié", subtitle: "Partage ce lien pour inviter d'autres joueurs", mode: "info" });
    }

    const openRulesDialog = () => {
        dialog({
            title: "Règles",
            description: "Sorciers, votre objectif est d’invoquer des pierres précieuses pour créer des alignements ou capturer les pierres de vos adversaires. Cependant, la magie d’invocation de pierre précieuse est imprévisible ! Vous ne pouvez garantir la génération de votre pierre secrète de prédilection… Analysez, adaptez votre stratégie et anticipez les mouvements de vos adversaires pour gagner !",
            content: null
        });
    }

    const canStartGame = (currentPlayer && currentPlayer.isAdmin) && gameState.players.length > 1;

    return (<Section>
        <HomeLink to="/" aria-label='Accueil'>
            <PiCastleTurretDuotone />
        </HomeLink>
        <SettingsSection className={css({ flex: '2' })}>
            <SettingsHeading heading='h3'>
                Paramètres
            </SettingsHeading>
            <SettingsForm>
                <InputContainer>
                    <Label htmlFor="max-players">Nombre de joueurs maximum: <b>{maxPlayers[0]}</b></Label>
                    <Root
                        id="max-players"
                        value={maxPlayers}
                        onValueChange={setMaxPlayers}
                        max={6}
                        min={2}
                        step={1}>
                        <Track>
                            <Range />
                        </Track>
                        <Thumb aria-label="Max players" />
                    </Root>
                </InputContainer>
                <Button
                    type='button'
                    visual='outline'
                    size='sm'
                    onClick={openRulesDialog}>
                    Voir les règles
                </Button>
            </SettingsForm>
            <ActionButtons>
                <Button onClick={handleCopyShareLink}>
                    Copier le lien de partage
                </Button>
                <Button
                    tooltip={!canStartGame ? "Vous devez être admin ou être plus de 2 joueurs pour démarrer la partie" : undefined}
                    disabled={!canStartGame}
                    onClick={() => socketParty.send(JSON.stringify({ type: "start" }))}>
                    Démarrer la partie
                </Button>
            </ActionButtons>
        </SettingsSection>
        <PlayersSection className={css({ flex: '1' })}>
            <PlayerHeading heading='h3'>
                Joueurs ({gameState.players.length}):
            </PlayerHeading>
            <ListPlayers>
                {gameState.players.map((player) => (
                    <PlayerItem key={player.id}>
                        {player === currentPlayer ? 'Vous' : player.username} {player.isAdmin ? '(admin)' : ''}
                    </PlayerItem>
                ))}
            </ListPlayers>
        </PlayersSection>
    </Section>
    );
}