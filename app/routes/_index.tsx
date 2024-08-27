import { Form, redirect, useSearchParams } from "@remix-run/react";
import type { ActionFunctionArgs, MetaFunction } from "partymix";
import { styled } from "styled-system/jsx";
import { TextHeading } from "~/components/TextHeading";
import { pickRandomSlug } from "~/game/constants";
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

  const session = await getSession(
    request.headers.get("Cookie")
  );

  session.set("username", name);

  const roomId = pickRandomSlug();
  const randomString = Math.random().toString(36).substring(2, 10);

  const slug = code && type === 'join' ? code : `${roomId}-${randomString}`;

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

const Button = styled('button', {
  base: {
    bg: 'main',
    color: 'dark',
    border: '1px solid',
    borderColor: 'main',
    fontSize: 'md',
    padding: '0.5rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out',

    _hover: {
      bg: 'main/80',
    },

    _focusVisible: {
      outline: 'none',
      shadow: '0px 0px 0px 2px var(--shadow-color)',
      shadowColor: 'main/50',
    }
  }
});

export default function Index() {
  const [searchParams] = useSearchParams();
  const codeGame = searchParams.get("code");

  return (
    <Section>
      <HeadingTitle>
        Stratagèmes
      </HeadingTitle>
      <WelcomeText heading="h2">
        Bienvenue dans Stratagèmes, un jeu de placement de pions en ligne.
      </WelcomeText>
      <FormContainer method="post">
        <input readOnly type="hidden" name="code" value={codeGame || ""} />

        <InputContainer>
          <Label htmlFor="name">Votre nom de sorcier</Label>
          <Input type="text" id="name" name="name" placeholder="New wizard" required />
        </InputContainer>

        <ActionButtons>
          {Boolean(codeGame) && (
            <Button name="type" value="join">
              Rejoindre la partie
            </Button>
          )}
          <Button name="type" value="create">
            Créer une partie
          </Button>
        </ActionButtons>

      </FormContainer>
    </Section>
  );
}