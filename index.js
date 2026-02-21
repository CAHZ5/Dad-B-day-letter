

    /*
    ════════════════════════════════════════════════════════
      CONFIGURACIÓN DEL ÁLBUM
      ─────────────────────────────────────────────────────
      ACÁ ES DONDE VOS EDITÁS LAS FOTOS.

      Cada foto es un objeto con dos propiedades:
        - archivo: el nombre del archivo (tiene que estar
                   en la misma carpeta que este HTML)
        - caption: el texto que aparece abajo de la foto

      Para agregar una foto: copiás una línea y cambiás
      el nombre del archivo y el caption.
    ════════════════════════════════════════════════════════
    */
  const fotos = [
    { archivo: "Fotos/foto1.jpg", caption: "Un momento especial" },
    { archivo: "Fotos/foto2.jpg", caption: "Family" },
    { archivo: "Fotos/foto3.jpg", caption: "Recuerdos que guardo" },
    { archivo: "Fotos/foto4.jpg", caption: "Te quiero, Pa" },
    { archivo: "Fotos/foto5.jpg", caption: "Mis favoritos" },
    { archivo: "Fotos/foto6.jpg", caption: "Gracias por todo" },
    { archivo: "Fotos/foto7.jpg", caption: "Eres el mejor" },
  ];

    /*
    ════════════════════════════════════
      ESTADO DEL ÁLBUM
      Una sola variable que guarda en qué
      foto estamos parados actualmente.
      Empieza en 0 (la primera foto).
    ════════════════════════════════════
    */
    let fotoActual = 0;


    /*
    ════════════════════════════════════════════════════════
      construirAlbum()
      ─────────────────────────────────────────────────────
      Esta función se ejecuta UNA SOLA VEZ al cargar la página.
      Lee el array "fotos" de arriba y por cada foto:
        1. Crea un elemento HTML <div class="foto-item">
        2. Le agrega la imagen <img>
        3. Le agrega el pie de foto <p class="foto-caption">
        4. Lo mete dentro de la pista del álbum en el HTML

      También crea los puntitos de navegación.
    ════════════════════════════════════════════════════════
    */
    function construirAlbum() {
      const pista   = document.getElementById('album-pista');
      const puntos  = document.getElementById('album-puntos');

      fotos.forEach(function(foto, indice) {

        // --- crear el contenedor de la foto ---
        const item = document.createElement('div');
        item.className = 'foto-item';

        // --- crear la imagen ---
        const img = document.createElement('img');
        img.src = foto.archivo;
        img.alt = foto.caption;

        // --- crear el pie de foto ---
        const caption = document.createElement('p');
        caption.className = 'foto-caption';
        caption.textContent = foto.caption;

        // --- armar y agregar al DOM ---
        item.appendChild(img);
        item.appendChild(caption);
        pista.appendChild(item);

        // --- crear el puntito correspondiente ---
        const punto = document.createElement('div');
        punto.className = 'punto' + (indice === 0 ? ' activo' : '');
        punto.onclick = function() { irAFoto(indice); };
        puntos.appendChild(punto);
      });
    }


    /*
    ════════════════════════════════════════════════════════
      irAFoto(indice)
      ─────────────────────────────────────────────────────
      Navega a una foto específica por su número.
      Recibe el número de la foto (0, 1, 2...).
      - Mueve la pista con CSS transform
      - Actualiza el puntito activo
    ════════════════════════════════════════════════════════
    */
    function irAFoto(indice) {

      // guardar cuál es la foto actual
      fotoActual = indice;

      // mover la pista: cada foto tiene el mismo ancho + gap
      // calculamos cuánto mover en base al ancho de una foto
      const pista    = document.getElementById('album-pista');
      const anchoFoto = pista.children[0].offsetWidth + 24; // 24px = gap entre fotos
      const desplazamiento = indice * anchoFoto;

      pista.style.transform = `translateX(-${desplazamiento}px)`;

      // actualizar los puntos: quitar "activo" de todos, poner en el actual
      const puntos = document.querySelectorAll('.punto');
      puntos.forEach(function(punto, i) {
        punto.classList.toggle('activo', i === indice);
        // toggle(clase, condición) → agrega si true, quita si false
      });
    }


    /*
    ════════════════════════════════════════════════════════
      moverAlbum(direccion)
      ─────────────────────────────────────────────────────
      Se llama desde los botones ← y → del álbum.
      Recibe +1 (ir adelante) o -1 (ir atrás).
      Calcula la foto siguiente y llama a irAFoto().
    ════════════════════════════════════════════════════════
    */
    function moverAlbum(direccion) {

      // nueva foto: la actual + dirección
      let nuevaFoto = fotoActual + direccion;

      // si pasa del último, vuelve al primero (efecto circular)
      if (nuevaFoto >= fotos.length) nuevaFoto = 0;
      // si pasa del primero, va al último
      if (nuevaFoto < 0) nuevaFoto = fotos.length - 1;

      irAFoto(nuevaFoto);
    }


    /*
    ════════════════════════════════════════════════════════
      abrirCarta()
      ─────────────────────────────────────────────────────
      Se ejecuta cuando el usuario hace click en la pantalla
      de entrada. Hace tres cosas en orden:
        1. Oculta la pantalla de entrada (agrega clase CSS)
        2. Muestra el contenido principal (agrega clase CSS)
        3. Lanza los efectos visuales (confetti + globos)
    ════════════════════════════════════════════════════════
    */
    function abrirCarta() {

      // 1. ocultar pantalla de entrada
      document.getElementById('pantalla-entrada').classList.add('oculto');

      // 2. mostrar contenido
      document.getElementById('contenido').classList.add('visible');

      // 3. efectos!
      lanzarConfetti();
      lanzarGlobos();
    }


    /*
    ════════════════════════════════════════════════════════
      lanzarConfetti()
      ─────────────────────────────────────────────────────
      Dibuja partículas de confetti en el canvas.

      Cómo funciona:
      - Crea un array de "partículas", cada una con
        posición, velocidad, color, y tamaño aleatorio.
      - Cada frame de animación (requestAnimationFrame),
        limpia el canvas y vuelve a dibujar todas las
        partículas en su nueva posición.
      - Se detiene después de 350 frames (~6 segundos).
    ════════════════════════════════════════════════════════
    */
    function lanzarConfetti() {

      const canvas = document.getElementById('canvas-confetti');
      const ctx    = canvas.getContext('2d'); // contexto 2D para dibujar

      // que ocupe toda la pantalla
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;

      // colores del confetti — podés cambiarlos
      const colores = ['#c9a84c', '#f0d080', '#ffffff', '#e74c3c', '#3498db', '#2ecc71', '#e91e63'];

      // crear 140 partículas con valores aleatorios
      const particulas = [];
      for (let i = 0; i < 140; i++) {
        particulas.push({
          x:      Math.random() * canvas.width,       // posición horizontal aleatoria
          y:      Math.random() * -canvas.height,     // empieza arriba (fuera de pantalla)
          velocidadY: Math.random() * 2 + 1.5,        // velocidad de caída
          velocidadX: Math.random() * 1 - 0.5,        // deriva horizontal suave
          ancho:  Math.random() * 10 + 6,             // ancho de la partícula
          alto:   Math.random() * 5 + 3,              // alto de la partícula
          color:  colores[Math.floor(Math.random() * colores.length)],
          rotacion: Math.random() * Math.PI * 2,      // rotación inicial aleatoria
          velocidadRotacion: (Math.random() - 0.5) * 0.15, // giro
        });
      }

      let frame = 0;

      function dibujar() {

        // limpiar canvas del frame anterior
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // dibujar cada partícula
        particulas.forEach(function(p) {

          ctx.save(); // guarda el estado del canvas
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotacion);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.ancho / 2, p.alto / 2, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore(); // restaura el estado

          // mover la partícula para el próximo frame
          p.y        += p.velocidadY;
          p.x        += p.velocidadX + Math.sin(frame * 0.02 + p.x) * 0.4;
          p.rotacion += p.velocidadRotacion;

          // si sale por abajo, vuelve a aparecer por arriba
          if (p.y > canvas.height + 10) {
            p.y = -10;
          }
        });

        frame++;

        // seguir animando hasta frame 350, después limpiar
        if (frame < 350) {
          requestAnimationFrame(dibujar);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }

      dibujar(); // arrancar
    }


    /*
    ════════════════════════════════════════════════════════
      lanzarGlobos()
      ─────────────────────────────────────────────────────
      Crea 10 globos que flotan hacia arriba desde abajo.

      Cada globo es un <div> que se agrega al body con
      estilos calculados aleatoriamente (posición, tamaño,
      color, duración de la animación).

      Después de que termina su animación, se borra solo
      del DOM para no dejar elementos basura.
    ════════════════════════════════════════════════════════
    */
    function lanzarGlobos() {

      const colores = ['#e74c3c', '#f39c12', '#2ecc71', '#3498db', '#9b59b6', '#e91e63', '#1abc9c', '#e67e22'];

      // lanzar 10 globos con pequeño delay entre cada uno
      for (let i = 0; i < 10; i++) {

        setTimeout(function() {

          // contenedor del globo (posición fija en la pantalla)
          const wrap = document.createElement('div');
          wrap.className = 'globo-wrap';
          wrap.style.left = (Math.random() * 85 + 5) + 'vw'; // posición horizontal aleatoria

          // el globo en sí
          const globo = document.createElement('div');
          globo.className = 'globo';

          // tamaño aleatorio
          const tamano = Math.floor(Math.random() * 25 + 40) + 'px';
          globo.style.width  = tamano;
          globo.style.height = tamano;

          // color aleatorio con gradiente para dar volumen
          const color = colores[Math.floor(Math.random() * colores.length)];
          globo.style.background = `radial-gradient(circle at 35% 35%, ${aclarar(color)}, ${color})`;

          // duración aleatoria de la animación
          const duracion = Math.random() * 3 + 5; // entre 5 y 8 segundos
          globo.style.animation = `flotarArriba ${duracion}s ease-in forwards`;

          // armar y agregar al DOM
          wrap.appendChild(globo);
          document.body.appendChild(wrap);

          // borrar del DOM cuando termina la animación
          setTimeout(function() {
            wrap.remove();
          }, duracion * 1000 + 200);

        }, i * 300); // cada globo se lanza 300ms después del anterior
      }
    }


    /*
    ════════════════════════════════════════════════════════
      aclarar(colorHex)
      ─────────────────────────────────────────────────────
      Función auxiliar. Recibe un color en formato hex
      (#rrggbb) y devuelve una versión más clara del mismo.
      Se usa para crear el gradiente de brillo en los globos.
    ════════════════════════════════════════════════════════
    */
    function aclarar(hex) {
      const num   = parseInt(hex.slice(1), 16); // convertir hex a número
      const r     = Math.min(255, ((num >> 16) & 0xff) + 70); // rojo + 70
      const g     = Math.min(255, ((num >> 8)  & 0xff) + 70); // verde + 70
      const b     = Math.min(255, ((num)       & 0xff) + 70); // azul + 70
      // volver a hex y devolver
      return '#' + r.toString(16).padStart(2,'0')
                 + g.toString(16).padStart(2,'0')
                 + b.toString(16).padStart(2,'0');
    }


    /*
    ════════════════════════════════════════════════════════
      ANIMACIONES AL HACER SCROLL
      ─────────────────────────────────────────────────────
      IntersectionObserver es una API del navegador que
      "vigila" elementos y avisa cuando entran en pantalla.

      Seleccionamos todos los elementos con clase "animar-scroll"
      y cuando el usuario hace scroll y los ve, les agregamos
      la clase "visible" que activa la animación en el CSS.
    ════════════════════════════════════════════════════════
    */
    const observador = new IntersectionObserver(
      function(entradas) {
        entradas.forEach(function(entrada) {
          if (entrada.isIntersecting) {
            // entró en pantalla: hacer visible
            entrada.target.classList.add('visible');
            // dejar de observarlo (ya apareció, no necesitamos seguir)
            observador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.12 } // se activa cuando el 12% del elemento es visible
    );

    // observar todos los elementos que tienen que animarse
    document.querySelectorAll('.animar-scroll').forEach(function(elemento) {
      observador.observe(elemento);
    });


    /*
    ════════════════════════════════════════════════════════
      INICIALIZACIÓN
      ─────────────────────────────────────────────────────
      Esto se ejecuta cuando la página termina de cargar.
      Solo hace una cosa: construir el álbum de fotos.
    ════════════════════════════════════════════════════════
    */
    construirAlbum();
