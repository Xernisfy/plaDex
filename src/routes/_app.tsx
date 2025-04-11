import { type PageProps } from "denoland/fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="initial-scale=0.7" />
        <title>Pokémon Legenden: Wolfgang</title>
        <link rel="icon" type="image/png" href="/assets/favicon.png" />
        <link rel="stylesheet" href="/scss/style.scss" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
