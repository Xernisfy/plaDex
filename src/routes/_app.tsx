import { type PageProps } from "denoland/fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pokémon Legenden: Wolfgang</title>
        <link rel="icon" type="image/png" href="/assets/favicon.png" />
        <link rel="stylesheet" href="/sass/style.scss" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
