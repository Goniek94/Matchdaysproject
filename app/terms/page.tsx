import LegalLayout from "@/components/legal/LegalLayout";

export const metadata = {
  title: "Regulamin — Matchdays",
  description:
    "Regulamin platformy Matchdays — zasady korzystania, sprzedaży i kupowania piłkarskich pamiątek sportowych.",
};

const SECTIONS = [
  { id: "definicje",       title: "Definicje" },
  { id: "konto",           title: "Konto użytkownika" },
  { id: "sprzedaz",        title: "Wystawianie i sprzedaż" },
  { id: "kupno",           title: "Kupowanie i licytacje" },
  { id: "platnosci",       title: "Płatności, prowizje, wypłaty" },
  { id: "ai",              title: "Narzędzia AI" },
  { id: "subskrypcje",     title: "Subskrypcje" },
  { id: "moderacja",       title: "Moderacja i sankcje" },
  { id: "spory",           title: "Spory i Buyer Protection" },
  { id: "wlasnosc",        title: "Własność intelektualna" },
  { id: "odpowiedzialnosc", title: "Ograniczenie odpowiedzialności" },
  { id: "zmiany",          title: "Zmiany Regulaminu" },
  { id: "prawo",           title: "Prawo właściwe i spory sądowe" },
];

export default function TermsPage() {
  return (
    <LegalLayout
      title="Regulamin"
      lastUpdated="17 maja 2026"
      intro="Niniejszy regulamin określa zasady korzystania z platformy Matchdays — internetowego marketplace'u dla pamiątek sportowych (piłkarskich koszulek, butów, akcesoriów oraz przedmiotów kolekcjonerskich)."
      sections={SECTIONS}
    >
      <h2 id="definicje"><span className="num">01</span>Definicje</h2>
      <p>Na potrzeby niniejszego Regulaminu poniższe pojęcia mają następujące znaczenie:</p>
      <ul>
        <li><strong>Platforma</strong> — serwis internetowy Matchdays dostępny pod adresem matchdays.store (oraz domenach pomocniczych), prowadzony przez Operatora.</li>
        <li><strong>Operator</strong> — podmiot prowadzący Platformę (dane rejestrowe Operatora znajdują się w stopce serwisu).</li>
        <li><strong>Użytkownik</strong> — osoba fizyczna (powyżej 16. roku życia), prawna lub jednostka organizacyjna posiadająca konto na Platformie.</li>
        <li><strong>Sprzedający</strong> — Użytkownik wystawiający przedmiot na sprzedaż.</li>
        <li><strong>Kupujący</strong> — Użytkownik nabywający lub licytujący przedmiot.</li>
        <li><strong>Ogłoszenie</strong> — oferta sprzedaży konkretnego przedmiotu w formie aukcji lub „Kup teraz".</li>
        <li><strong>Zamówienie</strong> — umowa sprzedaży zawarta między Sprzedającym a Kupującym za pośrednictwem Platformy.</li>
      </ul>

      <h2 id="konto"><span className="num">02</span>Konto użytkownika</h2>
      <p>Rejestracja jest bezpłatna. Aby założyć konto, należy mieć ukończone 16 lat oraz podać prawdziwe i aktualne dane osobowe.</p>
      <p>Każdy Użytkownik może posiadać tylko jedno konto. Sprzedawanie z kont „pomocniczych" w celu manipulacji ocenami lub licytacjami jest zabronione i skutkuje permanentnym zablokowaniem wszystkich kont.</p>
      <p>Użytkownik ponosi odpowiedzialność za zachowanie poufności hasła i wszystkie działania wykonywane z jego konta. W przypadku podejrzenia nieautoryzowanego dostępu należy niezwłocznie zmienić hasło i zawiadomić Operatora.</p>

      <h2 id="sprzedaz"><span className="num">03</span>Wystawianie i sprzedaż</h2>
      <p>Sprzedający odpowiada za zgodność opisu ze stanem faktycznym przedmiotu — zdjęcia, opis, stan zachowania, autentyczność, rozmiar, ewentualne wady.</p>
      <p><strong>Zabronione jest:</strong></p>
      <ul>
        <li>wystawianie podróbek („replik") jako oryginałów,</li>
        <li>celowe wprowadzanie w błąd co do stanu przedmiotu,</li>
        <li>wystawianie przedmiotów, do których Sprzedający nie ma prawa,</li>
        <li>licytowanie własnych aukcji (shill bidding) lub umawianie się z innymi Użytkownikami w celu sztucznego windowania ceny,</li>
        <li>wystawianie tego samego przedmiotu pod wieloma ogłoszeniami jednocześnie,</li>
        <li>wystawianie przedmiotów niezgodnych z polityką platformy (np. obraźliwe treści, gadżety nielegalne).</li>
      </ul>
      <p>Każde ogłoszenie przechodzi moderację — Operator zastrzega sobie prawo do odrzucenia ogłoszenia bez podania szczegółowego uzasadnienia, jeśli narusza ono Regulamin.</p>

      <h2 id="kupno"><span className="num">04</span>Kupowanie i licytacje</h2>
      <p>Złożenie oferty w aukcji jest <strong>wiążące</strong>. Po wygranej aukcji Kupujący zobowiązany jest do opłacenia zamówienia w ciągu 48 godzin.</p>
      <p>Wycofanie oferty jest możliwe wyłącznie przed zakończeniem aukcji i tylko w wyjątkowych przypadkach (np. błąd w opisie po stronie Sprzedającego). Wycofanie nieuzasadnione może skutkować ostrzeżeniem lub czasowym zablokowaniem konta.</p>
      <p>„Kup teraz" działa natychmiastowo — kliknięcie przycisku tworzy zamówienie ze statusem „oczekuje na płatność".</p>

      <h2 id="platnosci"><span className="num">05</span>Płatności, prowizje, wypłaty</h2>
      <p>Platforma pośredniczy w płatnościach — środki Kupującego są zatrzymywane w escrow do momentu potwierdzenia dostawy. Akceptowane metody: karta płatnicza (Stripe), portfel platformy.</p>
      <p>Prowizja platformy od sprzedaży jest zależna od taryfy Sprzedającego w momencie wystawienia ogłoszenia:</p>
      <ul>
        <li><strong>Free</strong> — 12%</li>
        <li><strong>Premium</strong> — 8%</li>
        <li><strong>Premium Pro</strong> — 6%</li>
        <li><strong>Elite</strong> — 5%</li>
      </ul>
      <p>Prowizja jest zaszywana w momencie utworzenia ogłoszenia i nie zmienia się po sprzedaży, niezależnie od zmiany taryfy Sprzedającego.</p>
      <p>Wypłata do Sprzedającego następuje po potwierdzeniu odbioru przez Kupującego (lub automatycznie po 7 dniach od oznaczenia jako dostarczone). Wypłaty realizowane są przez Stripe Connect na rachunek bankowy Sprzedającego.</p>

      <h2 id="ai"><span className="num">06</span>Narzędzia AI</h2>
      <p>Platforma udostępnia narzędzia oparte o sztuczną inteligencję — Smart Listing (generowanie opisów), Legit Check (analiza autentyczności), Price Oracle (sugestia ceny rynkowej).</p>
      <p><strong>Wyniki AI mają charakter pomocniczy.</strong> Analiza autentyczności wykonana przez AI nie stanowi gwarancji oryginalności przedmiotu — ostateczna decyzja o zatwierdzeniu ogłoszenia należy do moderatora. Operator nie ponosi odpowiedzialności za błędne wskazania AI.</p>
      <p>Korzystanie z narzędzi AI rozlicza się w kredytach przyznawanych zgodnie z aktualną taryfą Sprzedającego (3 kredyty miesięcznie w taryfie Free, więcej w taryfach płatnych).</p>

      <h2 id="subskrypcje"><span className="num">07</span>Subskrypcje</h2>
      <p>Subskrypcje płatne (Premium, Premium Pro, Elite) są rozliczane w cyklach miesięcznych lub rocznych. Anulować subskrypcję można w każdej chwili w panelu Użytkownika — zachowuje ona aktywność do końca opłaconego okresu.</p>
      <p>Niewykorzystane kredyty AI nie przechodzą na kolejny miesiąc.</p>
      <p>Operator zastrzega sobie prawo do zmiany cen subskrypcji z 30-dniowym uprzedzeniem — aktywni subskrybenci zachowują dotychczasową cenę do końca bieżącego okresu rozliczeniowego.</p>

      <h2 id="moderacja"><span className="num">08</span>Moderacja i sankcje</h2>
      <p>Naruszenia Regulaminu są karane systemem kartek:</p>
      <ul>
        <li><strong>🟡 Żółta kartka</strong> — drobne uchybienie (np. opóźniona wysyłka, brak kontaktu),</li>
        <li><strong>🟠 Pomarańczowa kartka</strong> — poważne uchybienie. Druga pomarańczowa = automatyczny ban czasowy.</li>
        <li><strong>🔴 Czerwona kartka</strong> — rażące naruszenie (oszustwo, podróbka). Automatyczny ban 30-dniowy.</li>
      </ul>
      <p>Operator może też wystawić ban bezpośrednio bez kartek w przypadku oczywistego oszustwa.</p>

      <h2 id="spory"><span className="num">09</span>Spory i Buyer Protection</h2>
      <p>Kupujący ma prawo zgłosić spór w terminie <strong>14 dni od potwierdzenia dostawy</strong> (lub spodziewanej daty dostawy w przypadku braku przesyłki). Powody mogą obejmować:</p>
      <ul>
        <li>przedmiot niezgodny z opisem (inny model, rozmiar, stan),</li>
        <li>podejrzenie podróbki,</li>
        <li>uszkodzenie nieujawnione w opisie,</li>
        <li>nieotrzymanie przesyłki mimo upływu deklarowanego czasu wysyłki.</li>
      </ul>
      <p>Operator rozpatruje spór na podstawie dowodów (zdjęć, korespondencji, dokumentów wysyłki) — szczegóły w <a href="/returns">Polityce zwrotów</a>.</p>

      <h2 id="wlasnosc"><span className="num">10</span>Własność intelektualna</h2>
      <p>Wszystkie elementy graficzne, logo Matchdays, treści edytorskie i kod platformy są własnością Operatora. Sprzedający, wystawiając ogłoszenie, oświadcza, że posiada prawa do zdjęć i treści — i udziela Operatorowi niewyłącznej licencji na ich publikację w zakresie niezbędnym do funkcjonowania serwisu.</p>

      <h2 id="odpowiedzialnosc"><span className="num">11</span>Ograniczenie odpowiedzialności</h2>
      <p>Operator pośredniczy w zawieraniu umów sprzedaży między Użytkownikami — nie jest stroną tych umów. Operator nie ponosi odpowiedzialności za:</p>
      <ul>
        <li>jakość, zgodność z opisem ani autentyczność przedmiotów oferowanych przez Sprzedających (poza zakresem Buyer Protection),</li>
        <li>czynności podejmowane przez Użytkowników poza Platformą,</li>
        <li>czasowe przerwy techniczne nieumożliwiające korzystania z serwisu.</li>
      </ul>
      <p>Maksymalna odpowiedzialność Operatora wobec Użytkownika ograniczona jest do wartości opłat poniesionych przez tego Użytkownika na rzecz Operatora w okresie 12 miesięcy poprzedzających zdarzenie powodujące roszczenie.</p>

      <h2 id="zmiany"><span className="num">12</span>Zmiany Regulaminu</h2>
      <p>Operator może zmienić Regulamin z ważnych przyczyn (zmiany prawa, rozwój usług, względy bezpieczeństwa). O zmianach Użytkownicy są informowani <strong>z 30-dniowym wyprzedzeniem</strong> drogą e-mailową oraz komunikatem w panelu. Brak akceptacji zmian uprawnia do usunięcia konta przed wejściem zmian w życie — opłacone subskrypcje są wówczas zwracane proporcjonalnie.</p>

      <h2 id="prawo"><span className="num">13</span>Prawo właściwe i spory sądowe</h2>
      <p>Regulamin podlega prawu polskiemu. Spory między Operatorem a Użytkownikiem będącym konsumentem są rozstrzygane przez sąd właściwy miejscowo dla konsumenta. Konsumentowi przysługuje również prawo do skorzystania z pozasądowych form rozwiązywania sporów (m.in. platforma ODR Komisji Europejskiej: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener">ec.europa.eu/consumers/odr</a>).</p>

      <p className="footer-note">
        Pytania dotyczące Regulaminu prosimy kierować na adres kontakt@matchdays.store lub przez formularz w sekcji <a href="/contact">Kontakt</a>.
      </p>
    </LegalLayout>
  );
}
