// app/terms-of-service/page.tsx
export default function TermsOfServicePage() {
  return (
    <main className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-3xl font-bold">Conditions d'utilisation</h1>

      <p>
        En utilisant notre service WhatsApp, vous acceptez les conditions
        suivantes établies par le cabinet <strong>Youssef Aboukir</strong>.
      </p>

      <section>
        <h2 className="text-xl font-semibold mt-4">Utilisation du service</h2>
        <p>
          Le service WhatsApp du cabinet est destiné à fournir des informations
          générales, des réponses automatiques, et un support de base. Il ne
          remplace en aucun cas une consultation médicale.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4">Responsabilité</h2>
        <p>
          Nous ne sommes pas responsables des décisions prises sur la base des
          réponses automatisées. Pour tout besoin médical, veuillez consulter
          directement en cabinet.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4">Modifications</h2>
        <p>
          Nous nous réservons le droit de modifier ces conditions à tout moment.
          Les changements prendront effet dès leur publication sur cette page.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mt-4">Contact</h2>
        <p>
          Si vous avez des questions concernant ces conditions, contactez-nous
          directement.
        </p>
      </section>
    </main>
  );
}
