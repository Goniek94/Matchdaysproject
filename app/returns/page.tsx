import LegalLayout from "@/components/legal/LegalLayout";

export const metadata = {
  title: "Polityka zwrotów i Buyer Protection — Matchdays",
  description:
    "Polityka zwrotów Matchdays — kiedy możesz zwrócić przedmiot, jak otworzyć spór i jak działa Buyer Protection.",
};

const SECTIONS = [
  { id: "buyer-protection", title: "Buyer Protection — w skrócie" },
  { id: "kiedy-zwrot",      title: "Kiedy możesz zgłosić zwrot" },
  { id: "proces",           title: "Jak otworzyć spór" },
  { id: "dowody",           title: "Wymagane dowody" },
  { id: "decyzja",          title: "Decyzja i terminy" },
  { id: "kategorie",        title: "Kategorie zwrotów" },
  { id: "wyjatki",          title: "Wyjątki i ograniczenia" },
  { id: "odstapienie",      title: "Prawo odstąpienia (B2C)" },
  { id: "wysylka-zwrotna",  title: "Wysyłka zwrotna" },
  { id: "platnosc-zwrotna", title: "Zwrot środków" },
];

export default function ReturnsPage() {
  return (
    <LegalLayout
      title="Polityka zwrotów"
      lastUpdated="17 maja 2026"
      intro="Każdy zakup na Matchdays jest objęty Buyer Protection. Jeżeli otrzymany przedmiot nie odpowiada opisowi, nie dotarł lub jest podróbką — możesz otworzyć spór i odzyskać pieniądze."
      sections={SECTIONS}
    >
      <h2 id="buyer-protection"><span className="num">01</span>Buyer Protection — w skrócie</h2>
      <p>Środki Kupującego są zatrzymywane przez Platformę w <strong>escrow</strong> aż do potwierdzenia odbioru. Sprzedający otrzymuje wypłatę dopiero po:</p>
      <ul>
        <li>potwierdzeniu odbioru przez Kupującego (kliknięcie „Potwierdź odbiór&quot;), lub</li>
        <li>upływie 7 dni od oznaczenia przesyłki jako dostarczonej przez przewoźnika,</li>
      </ul>
      <p>w zależności od tego, co nastąpi wcześniej. W okresie escrow każdy spór wstrzymuje wypłatę do momentu jego rozstrzygnięcia.</p>

      <h2 id="kiedy-zwrot"><span className="num">02</span>Kiedy możesz zgłosić zwrot</h2>
      <p>Możesz otworzyć spór w terminie <strong>14 dni</strong> od:</p>
      <ul>
        <li>potwierdzonej dostawy przesyłki, lub</li>
        <li>upływu deklarowanego przez Sprzedającego czasu wysyłki (jeśli przesyłka nie dotarła).</li>
      </ul>
      <p>Po upływie tego terminu standardowa ścieżka Buyer Protection wygasa — w wyjątkowych przypadkach (ukryta wada ujawniająca się później, podejrzenie podróbki, której nie sposób było wykryć od razu) możesz nadal skontaktować się z obsługą i sprawa zostanie indywidualnie rozpatrzona.</p>

      <h2 id="proces"><span className="num">03</span>Jak otworzyć spór</h2>
      <p>Krok po kroku:</p>
      <ul>
        <li>Wejdź w <strong>Historia zakupów → szczegóły zamówienia</strong> i kliknij <em>„Otwórz spór&quot;</em>.</li>
        <li>Wybierz kategorię (zobacz <a href="#kategorie">sekcję 06</a>).</li>
        <li>Opisz problem w 2–4 zdaniach.</li>
        <li>Dołącz <strong>zdjęcia</strong> i (jeśli dotyczy) <strong>dokumenty wysyłki</strong>.</li>
        <li>Sprzedający dostaje powiadomienie i ma 72 godziny na odpowiedź.</li>
        <li>Jeśli nie dojdziecie do porozumienia, moderator Matchdays podejmuje decyzję na podstawie dowodów.</li>
      </ul>

      <h2 id="dowody"><span className="num">04</span>Wymagane dowody</h2>
      <p>Im więcej dowodów, tym szybsza decyzja. Akceptujemy:</p>
      <ul>
        <li><strong>Zdjęcia otrzymanego przedmiotu</strong> z różnych ujęć — metki, szwy, hologramy, ewentualne uszkodzenia.</li>
        <li><strong>Zdjęcie przesyłki</strong> z widoczną etykietą i numerem nadania.</li>
        <li><strong>Korespondencję ze Sprzedającym</strong> (zrzuty ekranu z komunikatora platformy).</li>
        <li><strong>Dokumenty wysyłki</strong> — potwierdzenie tracking, awizo, protokół szkodowy od kuriera.</li>
        <li><strong>Opinię eksperta</strong> (przy podejrzeniu podróbki — opcjonalna, ale wzmacnia sprawę).</li>
      </ul>

      <h2 id="decyzja"><span className="num">05</span>Decyzja i terminy</h2>
      <ul>
        <li><strong>72 godziny</strong> — Sprzedający odpowiada na spór.</li>
        <li><strong>5 dni roboczych</strong> — moderator wydaje decyzję po wymianie dowodów.</li>
        <li><strong>3 dni robocze</strong> — odwołanie od decyzji (przy nowych dowodach).</li>
      </ul>
      <p>Decyzja moderatora może być następująca:</p>
      <ul>
        <li><strong>Pełny zwrot</strong> — środki wracają do Kupującego, Sprzedający odbiera towar na własny koszt.</li>
        <li><strong>Zwrot częściowy</strong> — uzgodniona obniżka ceny rekompensująca wadę.</li>
        <li><strong>Odrzucenie</strong> — Sprzedający otrzymuje wypłatę, escrow zostaje zwolniony.</li>
      </ul>

      <h2 id="kategorie"><span className="num">06</span>Kategorie zwrotów</h2>
      <ul>
        <li><strong>Przedmiot niezgodny z opisem</strong> — inny model, rozmiar, stan, kolor niż w ogłoszeniu.</li>
        <li><strong>Podróbka</strong> — przedmiot okazał się repliką, choć opisywany był jako oryginał.</li>
        <li><strong>Uszkodzenie ukryte</strong> — wady, których nie ujawniono na zdjęciach ani w opisie.</li>
        <li><strong>Nieotrzymanie</strong> — przesyłka nie dotarła w deklarowanym czasie.</li>
        <li><strong>Uszkodzenie w transporcie</strong> — opakowanie naruszone, towar zniszczony.</li>
      </ul>

      <h2 id="wyjatki"><span className="num">07</span>Wyjątki i ograniczenia</h2>
      <p>Zwrot <strong>NIE przysługuje</strong>, jeżeli:</p>
      <ul>
        <li>wada była wyraźnie opisana w ogłoszeniu lub widoczna na zdjęciach (np. „mały odprysk farby na rękawie&quot;),</li>
        <li>Kupujący zmienił zdanie — sam fakt „nie podoba mi się&quot; nie jest podstawą zwrotu w aukcjach (B2C ma odrębne prawo odstąpienia — patrz sekcja 08),</li>
        <li>Kupujący użył przedmiotu w sposób uniemożliwiający odsprzedaż (np. wypranie, dopasowanie),</li>
        <li>spór otwarto po upływie 14-dniowego terminu bez wykazania ukrytej wady.</li>
      </ul>

      <h2 id="odstapienie"><span className="num">08</span>Prawo odstąpienia (konsumenci, B2C)</h2>
      <p>Jeżeli kupujesz <strong>jako konsument</strong> od profesjonalnego Sprzedającego (sklepu zarejestrowanego w taryfie biznesowej), przysługuje Ci niezależnie ustawowe <strong>prawo odstąpienia od umowy w terminie 14 dni</strong> bez podania przyczyny (art. 27 ustawy o prawach konsumenta).</p>
      <p>Prawo odstąpienia <strong>nie przysługuje</strong> przy:</p>
      <ul>
        <li>aukcjach publicznych (zgodnie z art. 38 pkt 11 ustawy o prawach konsumenta),</li>
        <li>zakupach C2C między osobami prywatnymi.</li>
      </ul>
      <p>Z prawa odstąpienia można skorzystać wysyłając pisemne oświadczenie. Wzór dostępny w obsłudze klienta.</p>

      <h2 id="wysylka-zwrotna"><span className="num">09</span>Wysyłka zwrotna</h2>
      <p>Po pozytywnej decyzji o zwrocie Kupujący odsyła przedmiot na adres wskazany przez Sprzedającego. Koszt wysyłki zwrotnej:</p>
      <ul>
        <li><strong>pokrywa Sprzedający</strong> — w przypadku zwrotów uznanych z winy Sprzedającego (niezgodność z opisem, podróbka, uszkodzenie ukryte),</li>
        <li><strong>pokrywa Kupujący</strong> — w przypadku odstąpienia od umowy bez podania przyczyny (B2C).</li>
      </ul>
      <p>Przesyłka zwrotna powinna być nadana <strong>z numerem śledzenia</strong>. Zalecamy ubezpieczenie przesyłki o wartości przedmiotu.</p>

      <h2 id="platnosc-zwrotna"><span className="num">10</span>Zwrot środków</h2>
      <p>Po potwierdzeniu odbioru zwracanego przedmiotu przez Sprzedającego (lub po upływie 7 dni od potwierdzonej dostawy):</p>
      <ul>
        <li>środki wracają do Kupującego na pierwotną metodę płatności,</li>
        <li>czas przelewu zależy od operatora (Stripe / banki) — zwykle 3–7 dni roboczych,</li>
        <li>prowizja platformy jest zwracana w pełnej wysokości (Kupujący nie ponosi żadnych dodatkowych kosztów).</li>
      </ul>
      <p>W przypadku zwrotu częściowego — odpowiednia kwota jest pobierana z wypłaty Sprzedającego.</p>

      <p className="footer-note">
        Masz pytanie? Napisz do nas przez <a href="/contact">formularz kontaktowy</a> lub na <strong>kontakt@matchdays.store</strong>.
      </p>
    </LegalLayout>
  );
}
