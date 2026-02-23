export default function CookiesPolicy() {
  return (
    <div className="w-full bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto text-gray-800">
        <h1 className="text-3xl font-bold mb-8">Política de Cookies</h1>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">
            1. ¿Qué son las cookies?
          </h2>
          <p>
            Las cookies son pequeños archivos de datos que se descargan en su
            dispositivo (ordenador, móvil o tablet) cuando visita
            Hierroamedida.com. Estas cookies permiten a nuestra página web
            recordar información sobre su visita, como sus preferencias o su
            inicio de sesión, con la finalidad de mejorar la experiencia de
            usuario.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">
            2. Tipos de cookies que utilizamos
          </h2>
          <p>Hierroamedida.com utiliza los siguientes tipos de cookies:</p>
          <ul className="list-disc pl-5 mt-4 space-y-2">
            <li>
              <strong>Cookies técnicas:</strong> Necesarias para el correcto
              funcionamiento de la página web. Permiten la navegación y el uso
              de las diferentes opciones o servicios que se ofrecen.
            </li>
            <li>
              <strong>Cookies de personalización:</strong> Almacenan información
              sobre sus preferencias (por ejemplo, idioma o región) para
              personalizar su experiencia en la web.
            </li>
            <li>
              <strong>Cookies de análisis:</strong> Recogen información sobre el
              uso que hace de Hierroamedida.com (por ejemplo, páginas visitadas
              o tiempo de navegación) para mejorar su funcionamiento y ofrecerle
              un mejor servicio.
            </li>
            <li>
              <strong>Cookies de publicidad:</strong> Muestran anuncios
              personalizados en función de su comportamiento de navegación.
            </li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">
            3. Cookies de terceros
          </h2>
          <p>
            Hierroamedida.com puede utilizar servicios de terceros (como Google
            Analytics o redes sociales) que pueden instalar cookies propias para
            finalidades específicas, como el análisis del tráfico o la gestión
            de publicidad. No tenemos control directo sobre estas cookies, pero
            puede gestionarlas a través de las configuraciones de su navegador o
            desde las opciones que ofrecen estos propios servicios.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">4. Consentimiento</h2>
          <p>
            Al utilizar Hierroamedida.com, acepta el uso de cookies de acuerdo
            con esta política. No obstante, puede gestionar o revocar su
            consentimiento en cualquier momento mediante las opciones de
            configuración de su navegador o a través de nuestro gestor de
            cookies (si está disponible en la web).
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">
            5. ¿Cómo desactivar o eliminar las cookies?
          </h2>
          <p>
            Puede configurar su navegador para bloquear las cookies o recibir un
            aviso antes de que se descarguen. También puede eliminar las cookies
            ya instaladas. Tenga en cuenta que, si desactiva las cookies,
            algunas funcionalidades de Hierroamedida.com podrían no funcionar
            correctamente.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">
            6. Cambios en la política de cookies
          </h2>
          <p>
            Nos reservamos el derecho de modificar esta política de cookies en
            cualquier momento. Cualquier cambio será publicado en
            Hierroamedida.com, y en caso de cambios significativos, le
            notificaremos mediante un aviso visible o por correo electrónico.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">7. Más información</h2>
          <p>
            Si tiene cualquier duda o pregunta sobre la política de cookies de
            Hierroamedida.com, puede contactar con nosotros a través de las
            direcciones de contacto de nuestra página web o escribiéndonos
            directamente a{" "}
            <a
              href="mailto:hola@hierroamedida.com"
              className="text-rose-800 hover:underline"
            >
              hola@hierroamedida.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
