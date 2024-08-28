import { Form, redirect, useSearchParams } from "@remix-run/react";
import type { ActionFunctionArgs, MetaFunction } from "partymix";
import PartySocket from "partysocket";
import { useEffect, useState } from "react";
import { styled } from "styled-system/jsx";
import { Button } from "~/components/Button";
import { TextHeading } from "~/components/TextHeading";
import { useSocketConfig } from "~/context/SocketContext";
import { useUser } from "~/context/UserContext";
import { ACTIVE_ROOM_ID, pickRandomSlug } from "~/game/constants";
import { useDialog } from "~/hooks/useDialog";
import { getSession, commitSession } from '~/services/sessions';

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix SPA" },
    { name: "description", content: "Welcome to Remix (SPA Mode)!" },
  ];
};

export async function action({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = String(formData.get("name"));
  const code = String(formData.get("code"));
  const type = String(formData.get("type"));
  const publicGames = String(formData.get("rooms")).split(",");

  const roomId = pickRandomSlug();
  const randomString = Math.random().toString(36).substring(2, 10);
  let slug = `${roomId}-${randomString}`;
  if (code && type === 'join') {
    slug = code;
  } else if (publicGames.length && type === 'join-public') {
    slug = publicGames[0];
  }

  const session = await getSession(
    request.headers.get("Cookie")
  );

  session.set("username", name);

  return redirect(`/room/${slug}/lobby`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    }
  });
}

const HeadingTitle = styled(TextHeading, {
  base: {
    fontSize: '6xl',
  }
});

const Section = styled('section', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    padding: '1rem',
    alignSelf: 'flex-start',
  }
});

const FormContainer = styled(Form, {
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '2rem',
    gap: '4rem',

    bg: 'dark.secondary',
    shadow: '0px 0px 10px 0px var(--shadow-color)',
    shadowColor: 'main/50',
    border: '1px solid',
    borderColor: 'main',
    minW: 'clamp(400px, 50%, 800px)',
    minH: 'clamp(250px, 30vh, 800px)',
  }
});

const WelcomeText = styled(TextHeading, {
  base: {
    fontSize: 'md',
  }
});

const InputContainer = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  }
});

const Label = styled('label', {
  base: {
    fontSize: 'md',
    color: 'white',
    fontWeight: 'bold',
    fontStyle: 'italic',
  }
});

const Input = styled('input', {
  base: {
    fontSize: 'md',
    border: '1px solid',
    borderColor: 'white',
    padding: '0.5rem',
    color: 'main',
    fontWeight: 'bold',

    _placeholder: {
      color: 'main/50',
    },

    _focusVisible: {
      outline: 'none',
      borderColor: 'main',
    }
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

export default function Index() {
  const [searchParams] = useSearchParams();
  const {host} = useSocketConfig();
  const {username} = useUser();
  const codeGame = searchParams.get("code");
  const [activeRooms, setActiveRooms] = useState<string[]>([]);
  const dialog = useDialog();

  useEffect(() => {
    const fetchActiveRooms = async () => {
      const response = await PartySocket.fetch(
        { host: host, room: ACTIVE_ROOM_ID, party: "active_rooms" },
        {
          method: "GET"
        }
      );

      const data = await response.json();
      setActiveRooms(data.rooms);
    };

    fetchActiveRooms();
  }, []);

  const openRulesDialog = () => {
    dialog({
      title: "Règles",
      description: "Sorciers, votre objectif est d’invoquer des pierres précieuses pour créer des alignements ou capturer les pierres de vos adversaires. Cependant, la magie d’invocation de pierre précieuse est imprévisible ! Vous ne pouvez garantir la génération de votre pierre secrète de prédilection… Analysez, adaptez votre stratégie et anticipez les mouvements de vos adversaires pour gagner !",
      content: null
    });
  }

  return (
    <Section>
      <HeadingTitle>
        Stratagèmes
      </HeadingTitle>
      <WelcomeText heading="h2">
        Bienvenue dans Stratagèmes, un jeu de plateau en ligne.
      </WelcomeText>
      <FormContainer method="post">
        <input readOnly type="hidden" name="code" value={codeGame || ""} />
        <input readOnly type="hidden" name="rooms" value={activeRooms.join(",")} />

        <InputContainer>
          <Label htmlFor="name">Votre nom de sorcier</Label>
          <Input type="text" id="name" name="name" defaultValue={username || ""} placeholder="New wizard" required />
        </InputContainer>

        <Button
          type='button'
          visual='outline'
          size='sm'
          onClick={openRulesDialog}>
          Voir les règles
        </Button>

        <ActionButtons>
          <Button
            name="type"
            value="join"
            disabled={!codeGame}
            tooltip={!codeGame ? "Utilise un lien de partage pour rejoindre une partie" : undefined}>
            Rejoindre la partie
          </Button>
          <Button
            name="type"
            value="join-public"
            disabled={!activeRooms.length}
            tooltip={!activeRooms.length ? "Aucune partie publique n'est disponible" : undefined}>
            Rejoindre une partie publique
          </Button>
          <Button name="type" value="create">
            Créer une partie
          </Button>
        </ActionButtons>

      </FormContainer>
    </Section>
  );
}