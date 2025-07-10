export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-3xl font-bold">Politique de confidentialité</h1>

      <p>
        Cette politique de confidentialité explique comment{' '}
        <strong>Youssef Aboukir</strong> collecte, utilise et protège vos
        informations personnelles lors de l'utilisation de notre service
        WhatsApp.
      </p>

      <section>
        <h2 className="text-xl font-semibold mt-4">
          Collecte des informations
        </h2>
        <p>
          Nous collectons uniquement les informations nécessaires, telles que
          votre nom, numéro de téléphone, et langue préférée, pour améliorer
          notre service.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4">Utilisation des données</h2>
        <p>
          Vos données sont utilisées uniquement pour personnaliser les réponses
          automatisées et améliorer votre expérience avec notre cabinet
          dentaire.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4">Protection des données</h2>
        <p>
          Nous utilisons des pratiques sécurisées pour protéger vos données et
          ne les partageons jamais avec des tiers sans votre consentement.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4">Contact</h2>
        <p>
          Pour toute question concernant cette politique, vous pouvez nous
          contacter via WhatsApp ou en cabinet.
        </p>
      </section>
    </main>
  );
}
