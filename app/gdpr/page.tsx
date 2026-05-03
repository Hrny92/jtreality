import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ResetCookiesButton from '@/components/ResetCookiesButton'

export const metadata = {
  title: 'Ochrana osobních údajů (GDPR) | JT Reality',
  description: 'Informace o zpracování osobních údajů a zásadách cookies na webu JT Reality.',
}

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-14 scroll-mt-28">
      <h2 className="font-display text-2xl font-bold mb-5 text-white">{title}</h2>
      <div className="space-y-4 text-white/55 text-sm leading-relaxed">{children}</div>
    </section>
  )
}

export default function GdprPage() {
  return (
    <main className="bg-dark min-h-screen">
      <Navigation />

      {/* Hero */}
      <div className="pt-36 pb-16 border-b border-white/6">
        <div className="container mx-auto px-6 md:px-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-gold text-[10px] tracking-[0.35em] uppercase">JT Reality</span>
            <span className="block w-8 h-[1px] bg-white/10" />
            <span className="text-white/30 text-[10px] tracking-[0.22em] uppercase">Právní dokumenty</span>
          </div>
          <h1 className="font-display text-[clamp(2rem,5vw,4rem)] font-bold leading-tight">
            Ochrana osobních údajů
            <br /><span className="text-gold">& Zásady cookies</span>
          </h1>
          <p className="text-white/35 mt-4 text-sm">Platné od 1. 1. 2024 · Poslední aktualizace: 1. 1. 2024</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 md:px-10 py-20 max-w-3xl">

        <Section title="1. Správce osobních údajů">
          <p>
            Správcem osobních údajů je fyzická osoba — realitní makléř:
          </p>
          <div className="border border-white/8 p-6 space-y-2">
            <p><span className="text-white/30">Jméno:</span> <span className="text-white/70">Jiří (Jura) Temer</span></p>
            <p><span className="text-white/30">Obchodní firma:</span> <span className="text-white/70">JT Reality</span></p>
            <p><span className="text-white/30">Sídlo:</span> <span className="text-white/70">[Doplnit adresu]</span></p>
            <p><span className="text-white/30">E-mail:</span> <span className="text-white/70">[Doplnit e-mail]</span></p>
            <p><span className="text-white/30">Telefon:</span> <span className="text-white/70">[Doplnit telefon]</span></p>
            <p><span className="text-white/30">IČO:</span> <span className="text-white/70">[Doplnit IČO]</span></p>
          </div>
        </Section>

        <Section title="2. Jaké osobní údaje zpracováváme">
          <p>V rámci provozu webu a poskytování realitních služeb zpracováváme tyto kategorie osobních údajů:</p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong className="text-white/70">Identifikační údaje</strong> — jméno, příjmení</li>
            <li><strong className="text-white/70">Kontaktní údaje</strong> — e-mailová adresa, telefonní číslo</li>
            <li><strong className="text-white/70">Komunikační záznamy</strong> — obsah zpráv zaslaných prostřednictvím kontaktního formuláře</li>
            <li><strong className="text-white/70">Technické údaje</strong> — IP adresa, typ prohlížeče, doba návštěvy (cookies, viz sekce 7)</li>
          </ul>
        </Section>

        <Section title="3. Účel a právní základ zpracování">
          <p>Vaše osobní údaje zpracováváme pro tyto účely:</p>
          <div className="space-y-4">
            {[
              {
                ucel: 'Odpověď na poptávku / konzultace',
                zaklad: 'Oprávněný zájem (čl. 6 odst. 1 písm. f) GDPR)',
                doba: '2 roky od posledního kontaktu',
              },
              {
                ucel: 'Plnění smlouvy o zprostředkování',
                zaklad: 'Plnění smlouvy (čl. 6 odst. 1 písm. b) GDPR)',
                doba: '10 let od ukončení smlouvy (zákonná povinnost)',
              },
              {
                ucel: 'Zasílání obchodních sdělení (newsletter)',
                zaklad: 'Souhlas (čl. 6 odst. 1 písm. a) GDPR)',
                doba: 'Do odvolání souhlasu',
              },
              {
                ucel: 'Analytika webu (cookies)',
                zaklad: 'Souhlas (čl. 6 odst. 1 písm. a) GDPR)',
                doba: 'Viz sekce 7',
              },
            ].map((r) => (
              <div key={r.ucel} className="border border-white/8 p-4">
                <p className="text-white/70 font-medium mb-1">{r.ucel}</p>
                <p className="text-xs text-white/35">Právní základ: {r.zaklad}</p>
                <p className="text-xs text-white/35">Doba uchování: {r.doba}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="4. Příjemci osobních údajů">
          <p>
            Vaše osobní údaje neprodáváme ani nepředáváme třetím stranám pro jejich vlastní marketingové účely.
            Pro zajištění provozu webu a komunikace mohou mít k údajům přístup tito zpracovatelé:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Poskytovatel webhostingu a e-mailových služeb</li>
            <li>Nástroje pro analýzu návštěvnosti (Google Analytics — pouze při udělení souhlasu s cookies)</li>
            <li>Účetní a právní poradci (v rozsahu nezbytném pro plnění zákonných povinností)</li>
          </ul>
          <p>Všichni zpracovatelé jsou vázáni mlčenlivostí a zpracovávají údaje výhradně dle našich pokynů.</p>
        </Section>

        <Section title="5. Vaše práva">
          <p>Podle GDPR máte tato práva:</p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong className="text-white/70">Právo na přístup</strong> — kdykoli nás můžete požádat o kopii údajů, které o vás zpracováváme.</li>
            <li><strong className="text-white/70">Právo na opravu</strong> — pokud jsou vaše údaje nepřesné, opravíme je.</li>
            <li><strong className="text-white/70">Právo na výmaz</strong> — za splnění zákonných podmínek údaje smažeme.</li>
            <li><strong className="text-white/70">Právo na omezení zpracování</strong> — v určitých případech můžete zpracování omezit.</li>
            <li><strong className="text-white/70">Právo na přenositelnost</strong> — poskytneme vám údaje ve strojově čitelném formátu.</li>
            <li><strong className="text-white/70">Právo vznést námitku</strong> — můžete namítat zpracování na základě oprávněného zájmu.</li>
            <li><strong className="text-white/70">Právo odvolat souhlas</strong> — udělený souhlas lze kdykoli odvolat (nemá zpětný účinek).</li>
          </ul>
          <p>
            Žádost uplatněte e-mailem na adrese [Doplnit e-mail]. Odpovíme do 30 dnů.
            Máte rovněž právo podat stížnost u Úřadu pro ochranu osobních údajů (
            <a href="https://www.uoou.cz" className="text-gold hover:underline" target="_blank" rel="noopener">www.uoou.cz</a>
            ).
          </p>
        </Section>

        <Section title="6. Zabezpečení údajů">
          <p>
            Přijímáme technická a organizační opatření k ochraně vašich osobních údajů před neoprávněným přístupem,
            ztrátou nebo zničením. Web je provozován přes zabezpečené připojení HTTPS.
          </p>
        </Section>

        <Section id="cookies" title="7. Zásady cookies">
          <p>
            Cookies jsou malé textové soubory ukládané do vašeho zařízení při návštěvě webu.
            Používáme tyto typy cookies:
          </p>
          <div className="space-y-3">
            {[
              {
                typ: 'Nezbytné cookies',
                popis: 'Zajišťují základní funkce webu (např. uložení souhlasu s cookies). Nelze je odmítnout.',
                doba: 'Do zavření prohlížeče / 1 rok',
                souhlas: 'Nevyžadován',
              },
              {
                typ: 'Analytické cookies',
                popis: 'Google Analytics — anonymní měření návštěvnosti (počet návštěv, zdroje provozu, chování na webu).',
                doba: '2 roky',
                souhlas: 'Vyžadován',
              },
            ].map((c) => (
              <div key={c.typ} className="border border-white/8 p-4">
                <p className="text-white/70 font-medium mb-1">{c.typ}</p>
                <p className="text-xs text-white/45 mb-1">{c.popis}</p>
                <p className="text-xs text-white/30">Platnost: {c.doba} · Souhlas: {c.souhlas}</p>
              </div>
            ))}
          </div>
          <p>
            Svůj souhlas s analytickými cookies můžete kdykoli odvolat smazáním dat webu v nastavení prohlížeče,
            nebo kliknutím na tlačítko níže.
          </p>
          <ResetCookiesButton />
        </Section>

        <Section title="8. Změny dokumentu">
          <p>
            Tento dokument můžeme průběžně aktualizovat. Aktuální verze je vždy dostupná na této stránce
            s uvedeným datem poslední aktualizace. Doporučujeme pravidelnou kontrolu.
          </p>
        </Section>

      </div>

      <Footer />
    </main>
  )
}
