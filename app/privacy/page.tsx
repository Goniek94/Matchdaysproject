import LegalLayout from "@/components/legal/LegalLayout";

export const metadata = {
  title: "Polityka prywatności — Matchdays",
  description:
    "Polityka prywatności Matchdays — jak przetwarzamy Twoje dane osobowe zgodnie z RODO.",
};

const SECTIONS = [
  { id: "administrator",   title: "Administrator danych" },
  { id: "jakie-dane",      title: "Jakie dane zbieramy" },
  { id: "cel",             title: "Cel i podstawa przetwarzania" },
  { id: "udostepnianie",   title: "Komu udostępniamy dane" },
  { id: "transfer",        title: "Transfer poza EOG" },
  { id: "okres",           title: "Okres przechowywania" },
  { id: "prawa",           title: "Twoje prawa" },
  { id: "cookies",         title: "Pliki cookies" },
  { id: "bezpieczenstwo",  title: "Bezpieczeństwo danych" },
  { id: "skargi",          title: "Skargi i kontakt" },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Polityka prywatności"
      lastUpdated="17 maja 2026"
      intro="Twoja prywatność jest dla nas priorytetem. Poniżej wyjaśniamy, jakie dane zbieramy, dlaczego, komu je udostępniamy oraz jakie masz prawa zgodnie z RODO (Rozporządzenie Parlamentu Europejskiego i Rady UE 2016/679)."
      sections={SECTIONS}
    >
      <h2 id="administrator"><span className="num">01</span>Administrator danych</h2>
      <p>Administratorem Twoich danych osobowych w rozumieniu art. 4 pkt 7 RODO jest podmiot prowadzący platformę Matchdays (dane rejestrowe dostępne w stopce serwisu oraz w <a href="/contact">sekcji kontaktowej</a>).</p>
      <p>W sprawach związanych z przetwarzaniem danych osobowych prosimy kontaktować się pod adresem: <strong>privacy@matchdays.store</strong>.</p>

      <h2 id="jakie-dane"><span className="num">02</span>Jakie dane zbieramy</h2>
      <h3>Dane konta</h3>
      <ul>
        <li>imię, nazwisko, nazwa użytkownika,</li>
        <li>adres e-mail,</li>
        <li>numer telefonu (opcjonalnie),</li>
        <li>data urodzenia (weryfikacja wieku — powyżej 16. roku życia),</li>
        <li>kraj,</li>
        <li>hasło (przechowywane jako bcrypt hash — nigdy nie mamy dostępu do hasła w postaci jawnej).</li>
      </ul>

      <h3>Dane transakcyjne</h3>
      <ul>
        <li>adres dostawy (przy zakupie),</li>
        <li>historia zamówień, sprzedaży, licytacji,</li>
        <li>dane bankowe dla wypłat (obsługiwane przez Stripe Connect — my przechowujemy jedynie zaszyfrowane referencje do konta Stripe).</li>
      </ul>

      <h3>Dane techniczne</h3>
      <ul>
        <li>adres IP (logi logowania, fraud prevention),</li>
        <li>user-agent przeglądarki,</li>
        <li>identyfikatory sesji (cookies),</li>
        <li>zdarzenia użycia platformy (np. wystawienie ogłoszenia, otwarcie sporu).</li>
      </ul>

      <h3>Dane od narzędzi AI</h3>
      <p>Zdjęcia przesyłane do analizy AI są tymczasowo przekazywane do usługi Google Gemini i nie są przez nas przechowywane poza okresem przetwarzania. Treść wyników (np. ocena autentyczności) zapisywana jest przy odpowiednim ogłoszeniu.</p>

      <h2 id="cel"><span className="num">03</span>Cel i podstawa przetwarzania</h2>
      <ul>
        <li><strong>Wykonanie umowy</strong> (art. 6 ust. 1 lit. b RODO) — utrzymanie konta, realizacja zamówień, obsługa sporów.</li>
        <li><strong>Obowiązki prawne</strong> (art. 6 ust. 1 lit. c RODO) — przechowywanie dokumentów księgowych przez okres wymagany przepisami (5 lat dla faktur).</li>
        <li><strong>Prawnie uzasadniony interes</strong> (art. 6 ust. 1 lit. f RODO) — zapobieganie oszustwom, bezpieczeństwo systemu, dochodzenie roszczeń.</li>
        <li><strong>Zgoda</strong> (art. 6 ust. 1 lit. a RODO) — komunikacja marketingowa, niektóre cookies, profilowanie wykraczające poza statystyki techniczne. Zgodę można w każdej chwili wycofać.</li>
      </ul>

      <h2 id="udostepnianie"><span className="num">04</span>Komu udostępniamy dane</h2>
      <p>Twoje dane mogą być przekazywane wyłącznie:</p>
      <ul>
        <li><strong>Innym Użytkownikom</strong> — w zakresie niezbędnym do realizacji transakcji (np. adres dostawy widoczny dla Sprzedającego po zakupie),</li>
        <li><strong>Stripe</strong> — operatorowi płatności (płatności kartą + Stripe Connect dla wypłat),</li>
        <li><strong>Resend</strong> — dostawcy usług wysyłki e-mail transakcyjnych,</li>
        <li><strong>Google</strong> — w zakresie usługi Gemini (analiza zdjęć przez AI),</li>
        <li><strong>Railway, Vercel, Supabase</strong> — dostawcom infrastruktury chmurowej (hosting, baza danych, storage),</li>
        <li><strong>Uprawnionym organom państwowym</strong> — wyłącznie na podstawie obowiązujących przepisów prawa.</li>
      </ul>
      <p>Wszyscy procesorzy danych są związani umowami powierzenia spełniającymi wymogi art. 28 RODO.</p>

      <h2 id="transfer"><span className="num">05</span>Transfer poza EOG</h2>
      <p>Niektórzy nasi dostawcy (Stripe, Google) przetwarzają dane na serwerach poza Europejskim Obszarem Gospodarczym (głównie w USA). Transfer odbywa się na podstawie:</p>
      <ul>
        <li>standardowych klauzul umownych zatwierdzonych przez Komisję Europejską,</li>
        <li>certyfikacji EU-US Data Privacy Framework (gdzie dotyczy).</li>
      </ul>

      <h2 id="okres"><span className="num">06</span>Okres przechowywania</h2>
      <ul>
        <li><strong>Dane konta</strong> — przez czas posiadania konta + 1 rok od usunięcia (dochodzenie roszczeń).</li>
        <li><strong>Dane transakcyjne</strong> — 5 lat (obowiązki podatkowe i księgowe).</li>
        <li><strong>Logi techniczne</strong> — 12 miesięcy.</li>
        <li><strong>Korespondencja w sporach</strong> — 3 lata od zakończenia sporu.</li>
      </ul>
      <p>Po upływie okresu przechowywania dane są anonimizowane lub usuwane.</p>

      <h2 id="prawa"><span className="num">07</span>Twoje prawa</h2>
      <p>W każdej chwili przysługują Ci następujące prawa:</p>
      <ul>
        <li><strong>Dostęp do danych</strong> (art. 15 RODO) — możesz zapytać jakie dane przetwarzamy.</li>
        <li><strong>Sprostowanie</strong> (art. 16) — poprawienie nieprawidłowych danych.</li>
        <li><strong>Usunięcie</strong> („prawo do bycia zapomnianym", art. 17) — z zastrzeżeniem obowiązków prawnych nakładających przechowywanie.</li>
        <li><strong>Ograniczenie przetwarzania</strong> (art. 18).</li>
        <li><strong>Przenoszenie danych</strong> (art. 20) — eksport Twoich danych w formacie maszynowym.</li>
        <li><strong>Sprzeciw</strong> (art. 21) — w szczególności wobec przetwarzania w celach marketingowych.</li>
        <li><strong>Wycofanie zgody</strong> — w dowolnym momencie, bez wpływu na zgodność z prawem przetwarzania dokonanego wcześniej.</li>
      </ul>
      <p>Aby skorzystać z któregokolwiek z powyższych praw, skontaktuj się z nami pod adresem <strong>privacy@matchdays.store</strong>. Odpowiadamy w ciągu 30 dni.</p>

      <h2 id="cookies"><span className="num">08</span>Pliki cookies</h2>
      <p>Używamy następujących kategorii cookies:</p>
      <ul>
        <li><strong>Niezbędne</strong> — sesje logowania, tokeny CSRF, koszyk. Nie wymagają zgody.</li>
        <li><strong>Funkcjonalne</strong> — zapamiętanie preferencji (język, waluta, ustawienia listy).</li>
        <li><strong>Analityczne</strong> — anonimowe statystyki ruchu (wyłącznie po wyrażeniu zgody).</li>
      </ul>
      <p>Cookies można w każdej chwili zarządzać w ustawieniach przeglądarki.</p>

      <h2 id="bezpieczenstwo"><span className="num">09</span>Bezpieczeństwo danych</h2>
      <p>Stosujemy techniczne i organizacyjne środki ochrony danych adekwatne do ryzyka, w tym m.in.:</p>
      <ul>
        <li>szyfrowanie połączeń (HTTPS / TLS 1.3),</li>
        <li>hashowanie haseł (bcrypt),</li>
        <li>tokeny JWT z rotacją refresh tokenów,</li>
        <li>logowanie zdarzeń bezpieczeństwa i wykrywanie nadużyć,</li>
        <li>kontrolę dostępu do baz danych (least privilege).</li>
      </ul>

      <h2 id="skargi"><span className="num">10</span>Skargi i kontakt</h2>
      <p>Jeśli uznasz, że Twoje dane są przetwarzane niezgodnie z prawem, masz prawo wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych:</p>
      <p>
        <strong>Prezes UODO</strong><br />
        ul. Stawki 2, 00-193 Warszawa<br />
        <a href="https://uodo.gov.pl" target="_blank" rel="noopener">uodo.gov.pl</a>
      </p>

      <p className="footer-note">
        Z każdym pytaniem dotyczącym ochrony danych osobowych prosimy o kontakt: <strong>privacy@matchdays.store</strong>
      </p>
    </LegalLayout>
  );
}
