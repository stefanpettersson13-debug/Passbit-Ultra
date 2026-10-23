# My – valfri AI-anslutning

My fungerar lokalt utan nätverk. För längre AI-samtal kan en administratör ansluta en serverproxy. **GitHub Pages kan inte skydda API-nycklar. Lägg aldrig API-nycklar i HTML, JavaScript eller localStorage.**

## Cloudflare Worker
1. Skapa en Cloudflare Worker med koden i `server/my-ai-worker.js`.
2. Ange `OPENAI_API_KEY` som en hemlig Worker-miljövariabel.
3. Ange `ALLOWED_ORIGIN` exakt `https://stefanpettersson13-debug.github.io`.
4. Valfritt: `OPENAI_MODEL` (standard `gpt-4.1-mini`, kontrollera åtkomst).
5. **Inför autentisering och rate limiting innan publik driftsättning.** CORS är inte autentisering och skyddar inte mot direkta HTTP-anrop. Konfigurera även kostnadstak och övervakning.
6. Publicera Worker via HTTPS. I appen: My → Inställningar → ange Worker-URL → aktivera AI-läge.

## Integritet och begränsningar
- Lokal My skickar ingenting till servern.
- AI-läge skickar endast användarens chattmeddelanden till den konfigurerade proxyn.
- AI-chattens historik lagras i minnet, inte i localStorage. Endast proxy-URL lagras lokalt.
- Ingen API-nyckel sparas i webbläsaren.
- AI kan ge felaktiga svar. Verifiera tillverkarens datablad och säkerhetskrav.
- **Ingen AI-server har driftsatts.** Worker-koden är en startpunkt, inte en färdig säker publik produktionstjänst.
