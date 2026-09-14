/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CampoEjercicio {
  id: string;
  tipo: 'text' | 'textarea' | 'select' | 'radio' | 'fill-blanks';
  label: string;
  placeholder?: string;
  opciones?: string[];
  maxLength?: number;
  required?: boolean;
  valorCorrecto?: string | string[];
}

export interface EjemploEjercicio {
  pregunta: string;
  respuesta: string;
}

export interface Reactivo {
  id: string;
  titulo: string;
  instruccion: string;
  tipo: 'inputs-dobles' | 'glosario' | 'dialogo' | 'error-check' | 'textarea' | 'multiple-choice' | 'fill-blanks' | 'speaking' | 'short-answer' | 'vocabulary' | 'paragraph' | 'form' | 'matching';
  opciones?: string[];
  config: {
    labelA?: string;
    labelB?: string;
    placeholderA?: string;
    placeholderB?: string;
    placeholder?: string;
    label1?: string;
    label2?: string;
    label3?: string;
    label4?: string;
    promptIA1?: string;
    promptIA2?: string;
    errorKeywords?: string[];
    errorMessage?: string;
    correctKeywords?: string[];
  };
  // New detailed fields
  instrucciones?: string;
  ejemplo?: EjemploEjercicio;
  estimulo?: string;
  campos?: CampoEjercicio[];
  puntos?: number;
  tiempoEstimado?: string;
  referenciaTeoria?: string;
}

export const reactivosPorSemana: Record<number, Reactivo[]> = {
  1: [
    {
      id: "s1_r1",
      titulo: "Sujeto Obligatorio - Ejercicio Práctico",
      tipo: "fill-blanks",
      instruccion: "Completa las oraciones con el pronombre sujeto correcto (I, You, He, She, It, We, They) y la forma correcta del verbo BE (am, is, are).",
      instrucciones: "Escribe la oración completa en inglés usando el pronombre y verbo BE correctos según la traducción entre paréntesis.",
      ejemplo: {
        pregunta: "_____ _____ (ser) a software engineer.",
        respuesta: "I am a software engineer."
      },
      estimulo: "Escribe la oración completa en inglés:",
      campos: [
        {
          id: "s1_r1_oracion1",
          tipo: "text",
          label: "1. _____ _____ from Monterrey, Mexico. (Tú eres de Monterrey)",
          placeholder: "Ej: You are...",
          maxLength: 100,
          required: true,
          valorCorrecto: ["You are from Monterrey, Mexico.", "You're from Monterrey, Mexico."]
        },
        {
          id: "s1_r1_oracion2",
          tipo: "text",
          label: "2. _____ _____ a support engineer at the tech company. (Él es un ingeniero de soporte)",
          placeholder: "Ej: He is...",
          maxLength: 100,
          required: true,
          valorCorrecto: ["He is a support engineer at the tech company.", "He's a support engineer at the tech company."]
        },
        {
          id: "s1_r1_oracion3",
          tipo: "text",
          label: "3. _____ _____ ready for the TOEFL exam. (Nosotros estamos listos)",
          placeholder: "Ej: We are...",
          maxLength: 100,
          required: true,
          valorCorrecto: ["We are ready for the TOEFL exam.", "We're ready for the TOEFL exam."]
        },
        {
          id: "s1_r1_oracion4",
          tipo: "text",
          label: "4. _____ _____ bound to port 3000. (El servidor está vinculado al puerto 3000)",
          placeholder: "Ej: It is...",
          maxLength: 100,
          required: true,
          valorCorrecto: ["It is bound to port 3000.", "It's bound to port 3000."]
        }
      ],
      puntos: 20,
      tiempoEstimado: "8 min",
      referenciaTeoria: "Tabla de Subject Pronouns - Página 4",
      config: {
        placeholder: "Escribe la oración completa aquí..."
      }
    },
    {
      id: "s1_r2",
      titulo: "Formulario de Contacto del Alumno",
      tipo: "form",
      instruccion: "Completa este formulario de contacto personal en inglés. Usa oraciones completas cuando se indique.",
      instrucciones: "Completa cada campo con tu información personal. Los campos marcados con * son obligatorios.",
      ejemplo: {
        pregunta: "Full Name:",
        respuesta: "José Robert Garza Hernández"
      },
      estimulo: "STUDENT CONTACT INFORMATION FORM",
      campos: [
        {
          id: "s1_r2_nombre",
          tipo: "text",
          label: "Full Name (Nombre Completo):",
          placeholder: "Ej: John Smith",
          maxLength: 100,
          required: true
        },
        {
          id: "s1_r2_edad",
          tipo: "text",
          label: "Age (Edad):",
          placeholder: "Ej: 22 years old",
          maxLength: 50,
          required: true
        },
        {
          id: "s1_r2_nacionalidad",
          tipo: "text",
          label: "Nationality (Nacionalidad) - Usa oración completa:",
          placeholder: "Ej: I am Mexican.",
          maxLength: 100,
          required: true,
          valorCorrecto: ["I am mexican.", "I'm mexican.", "I am Mexican.", "I'm Mexican."]
        },
        {
          id: "s1_r2_idiomas",
          tipo: "text",
          label: "Languages You Speak (Idiomas que hablas) - Usa oración completa:",
          placeholder: "Ej: I speak Spanish and English.",
          maxLength: 150,
          required: true
        },
        {
          id: "s1_r2_ocupacion",
          tipo: "text",
          label: "Current Occupation (Ocupación actual) - Usa oración completa:",
          placeholder: "Ej: I am a computer engineering student.",
          maxLength: 150,
          required: true
        },
        {
          id: "s1_r2_motivo",
          tipo: "textarea",
          label: "Why Are You Learning English? (¿Por qué aprendes inglés?) - 2-3 oraciones:",
          placeholder: "Ej: I am learning English to improve my professional skills and get better job opportunities.",
          maxLength: 300,
          required: true
        }
      ],
      puntos: 25,
      tiempoEstimado: "10 min",
      referenciaTeoria: "Fórmulas de Cortesía - Página 5",
      config: {
        placeholder: "Completa tu información aquí..."
      }
    },
    {
      id: "s1_r3",
      titulo: "Glosario de Saludos y Cortesía",
      tipo: "matching",
      instruccion: "Une cada saludo en inglés con su significado en español y el momento apropiado de uso. Selecciona la opción correcta de cada menú desplegable.",
      instrucciones: "Selecciona la opción correcta para cada saludo inglés. Cada opción incluye la traducción y el momento de uso.",
      ejemplo: {
        pregunta: "Good morning → ?",
        respuesta: "Buenos días → Al llegar antes de las 12 PM"
      },
      estimulo: "Match each greeting with its Spanish translation and appropriate usage time:",
      campos: [
        {
          id: "s1_r3_saludo1",
          tipo: "select",
          label: "1. Good morning",
          opciones: [
            "Buenos días - Antes de 12 PM",
            "Buenas tardes - De 12 PM a 6 PM",
            "Buenas noches - Después de 6 PM",
            "Mucho gusto - Al conocer a alguien"
          ],
          required: true,
          valorCorrecto: "Buenos días - Antes de 12 PM"
        },
        {
          id: "s1_r3_saludo2",
          tipo: "select",
          label: "2. Good afternoon",
          opciones: [
            "Buenos días - Antes de 12 PM",
            "Buenas tardes - De 12 PM a 6 PM",
            "Buenas noches - Después de 6 PM",
            "Mucho gusto - Al conocer a alguien"
          ],
          required: true,
          valorCorrecto: "Buenas tardes - De 12 PM a 6 PM"
        },
        {
          id: "s1_r3_saludo3",
          tipo: "select",
          label: "3. Good evening",
          opciones: [
            "Buenos días - Antes de 12 PM",
            "Buenas tardes - De 12 PM a 6 PM",
            "Buenas noches - Después de 6 PM",
            "Mucho gusto - Al conocer a alguien"
          ],
          required: true,
          valorCorrecto: "Buenas noches - Después de 6 PM"
        },
        {
          id: "s1_r3_saludo4",
          tipo: "select",
          label: "4. Nice to meet you",
          opciones: [
            "Buenos días - Antes de 12 PM",
            "Buenas tardes - De 12 PM a 6 PM",
            "Buenas noches - Después de 6 PM",
            "Mucho gusto - Al conocer a alguien"
          ],
          required: true,
          valorCorrecto: "Mucho gusto - Al conocer a alguien"
        },
        {
          id: "s1_r3_saludo5",
          tipo: "select",
          label: "5. How are you?",
          opciones: [
            "¿Cómo estás? - Saludo informal",
            "¿De dónde eres? - Preguntar origen",
            "¿Qué haces? - Preguntar ocupación",
            "¿Cuántos años tienes? - Preguntar edad"
          ],
          required: true,
          valorCorrecto: "¿Cómo estás? - Saludo informal"
        }
      ],
      puntos: 15,
      tiempoEstimado: "5 min",
      referenciaTeoria: "Fórmulas de Cortesía - Página 5",
      config: {
        placeholder: "Selecciona la opción correcta..."
      }
    },
    {
      id: "s1_r4",
      titulo: "Simulación de Diálogo de Bienvenida",
      tipo: "dialogo",
      instruccion: "Completa el diálogo de primer contacto con tu tutor de Inteligencia Artificial. Escribe las líneas del Alumno (líneas 1 y 3).",
      instrucciones: "Escribe tu respuesta para cada línea del alumno. El tutor IA ya tiene sus líneas predefinidas.",
      ejemplo: {
        pregunta: "01. Alumno: (Tu primera línea)",
        respuesta: "Hello! My name is José. Nice to meet you."
      },
      estimulo: "Completa el diálogo de bienvenida:",
      campos: [
        {
          id: "s1_r4_linea1",
          tipo: "text",
          label: "01. Alumno: (Preséntate con tu nombre)",
          placeholder: "Ej: Hello! My name is...",
          maxLength: 150,
          required: true
        },
        {
          id: "s1_r4_linea2",
          tipo: "text",
          label: "02. Tutor IA: Nice to meet you! I am your institutional assistant. What is your nationality?",
          placeholder: "(Línea predefinida del tutor)",
          required: false
        },
        {
          id: "s1_r4_linea3",
          tipo: "text",
          label: "03. Alumno: (Responde tu nacionalidad)",
          placeholder: "Ej: I am Mexican.",
          maxLength: 100,
          required: true
        },
        {
          id: "s1_r4_linea4",
          tipo: "text",
          label: "04. Tutor IA: Excellent! Welcome to our language immersion experience. I look forward to working with you.",
          placeholder: "(Línea predefinida del tutor)",
          required: false
        }
      ],
      puntos: 15,
      tiempoEstimado: "6 min",
      referenciaTeoria: "Fórmulas de Cortesía - Página 5",
      config: {
        promptIA1: "Nice to meet you! I am your institutional assistant. What is your nationality?",
        promptIA2: "Excellent! Welcome to our language immersion experience. I look forward to working with you."
      }
    },
    {
      id: "s1_r5",
      titulo: "Redacción: Mi Perfil Personal",
      tipo: "textarea",
      instruccion: "Escribe un abstract corto sobre ti (mínimo 20 palabras) saludando al grupo e indicando tu nombre, edad e interés por aprender inglés.",
      instrucciones: "Escribe un párrafo de al menos 20 palabras presentándote al grupo. Incluye: saludo, nombre, edad, nacionalidad y por qué aprendes inglés.",
      ejemplo: {
        pregunta: "Redacta tu perfil personal:",
        respuesta: "Hello everyone! My name is José Garza. I am 22 years old and I am from Monterrey, Mexico. I am learning English to improve my professional skills and work in international companies."
      },
      estimulo: "Escribe tu perfil personal (mínimo 20 palabras):",
      campos: [
        {
          id: "s1_r5_perfil",
          tipo: "textarea",
          label: "Mi Perfil Personal",
          placeholder: "Hello everyone! My name is... I am... years old. I am from... I am learning English because...",
          maxLength: 500,
          required: true
        }
      ],
      puntos: 25,
      tiempoEstimado: "8 min",
      referenciaTeoria: "Fórmulas de Cortesía - Página 5",
      config: {
        placeholder: "Hello everyone, my name is..."
      }
    }
  ],
  2: [
    {
      id: "s2_r1",
      titulo: "Glosario del Aula de Clases",
      tipo: "vocabulary",
      instruccion: "Identifica y escribe 5 objetos que puedas encontrar en un aula de clases o espacio de estudio. Usa el artículo correcto (a/an/the) antes de cada objeto.",
      instrucciones: "Escribe 5 objetos del aula con su artículo correcto. Ejemplo: 'a whiteboard', 'an eraser'.",
      ejemplo: {
        pregunta: "Objeto del aula → ?",
        respuesta: "a whiteboard → Un pizarrón blanco"
      },
      estimulo: "Escribe 5 objetos del aula con artículo:",
      campos: [
        {
          id: "s2_r1_objeto1",
          tipo: "text",
          label: "1. (Ej: a whiteboard)",
          placeholder: "a/an + objeto",
          maxLength: 50,
          required: true
        },
        {
          id: "s2_r1_objeto2",
          tipo: "text",
          label: "2.",
          placeholder: "a/an + objeto",
          maxLength: 50,
          required: true
        },
        {
          id: "s2_r1_objeto3",
          tipo: "text",
          label: "3.",
          placeholder: "a/an + objeto",
          maxLength: 50,
          required: true
        },
        {
          id: "s2_r1_objeto4",
          tipo: "text",
          label: "4.",
          placeholder: "a/an + objeto",
          maxLength: 50,
          required: true
        },
        {
          id: "s2_r1_objeto5",
          tipo: "text",
          label: "5.",
          placeholder: "a/an + objeto",
          maxLength: 50,
          required: true
        }
      ],
      puntos: 15,
      tiempoEstimado: "6 min",
      referenciaTeoria: "Demonstratives and Articles - Página 6",
      config: {
        placeholder: "a/an + objeto del aula"
      }
    },
    {
      id: "s2_r2",
      titulo: "Demostrativos de Distancia (This/That/These/Those)",
      tipo: "fill-blanks",
      instruccion: "Completa cada oración usando el demostrativo correcto (This, That, These, Those) según la distancia y si el objeto es singular o plural.",
      instrucciones: "Selecciona el demostrativo correcto para cada situación. Recuerda: This/That = singular, These/Those = plural.",
      ejemplo: {
        pregunta: "_____ is my pen. (El lápiz está en tu mano - cercano, singular)",
        respuesta: "This is my pen."
      },
      estimulo: "Completa con el demostrativo correcto:",
      campos: [
        {
          id: "s2_r2_oracion1",
          tipo: "text",
          label: "1. _____ pen is on my desk. (Este lápiz - singular, cercano)",
          placeholder: "This",
          maxLength: 20,
          required: true,
          valorCorrecto: ["This"]
        },
        {
          id: "s2_r2_oracion2",
          tipo: "text",
          label: "2. _____ books are on the shelf. (Esos libros - plural, lejano)",
          placeholder: "Those",
          maxLength: 20,
          required: true,
          valorCorrecto: ["Those"]
        },
        {
          id: "s2_r2_oracion3",
          tipo: "text",
          label: "3. _____ computer is very fast. (Esta computadora - singular, cercano)",
          placeholder: "This",
          maxLength: 20,
          required: true,
          valorCorrecto: ["This"]
        },
        {
          id: "s2_r2_oracion4",
          tipo: "text",
          label: "4. _____ notebooks are mine. (Estos cuadernos - plural, cercano)",
          placeholder: "These",
          maxLength: 20,
          required: true,
          valorCorrecto: ["These"]
        }
      ],
      puntos: 20,
      tiempoEstimado: "7 min",
      referenciaTeoria: "Demonstratives and Articles - Página 6",
      config: {
        placeholder: "Escribe el demostrativo correcto..."
      }
    },
    {
      id: "s2_r3",
      titulo: "Inventario: Objetos con Artículos",
      tipo: "form",
      instruccion: "Describe qué objetos tienes a la mano en tu espacio de estudio usando artículos (a/an/the) y demostrativos (this/that/these/those).",
      instrucciones: "Completa cada campo describiendo objetos reales de tu entorno. Usa oraciones completas.",
      ejemplo: {
        pregunta: "Objeto singular en tu escritorio:",
        respuesta: "I have a pen on my desk."
      },
      estimulo: "Describe tus objetos de estudio:",
      campos: [
        {
          id: "s2_r3_singular",
          tipo: "text",
          label: "Un objeto singular en tu escritorio (usa 'a' o 'an'):",
          placeholder: "Ej: I have a laptop on my desk.",
          maxLength: 150,
          required: true
        },
        {
          id: "s2_r3_plural",
          tipo: "text",
          label: "Varios objetos en tu mochila (usa 'some' o 'the'):",
          placeholder: "Ej: I have some books in my backpack.",
          maxLength: 150,
          required: true
        },
        {
          id: "s2_r3_cercano",
          tipo: "text",
          label: "Un objeto cercano a ti (usa 'this' o 'these'):",
          placeholder: "Ej: This phone is on the table.",
          maxLength: 150,
          required: true
        },
        {
          id: "s2_r3_lejano",
          tipo: "text",
          label: "Un objeto lejano (usa 'that' o 'those'):",
          placeholder: "Ej: That whiteboard is on the wall.",
          maxLength: 150,
          required: true
        }
      ],
      puntos: 20,
      tiempoEstimado: "8 min",
      referenciaTeoria: "Demonstratives and Articles - Página 6",
      config: {
        placeholder: "Describe el objeto aquí..."
      }
    },
    {
      id: "s2_r4",
      titulo: "Concordancia de Demostrativos y Plurales",
      tipo: "error-check",
      instruccion: "Encuentra y corrige el error de concordancia en cada oración. El demostrativo debe coincidir en número con el sustantivo.",
      instrucciones: "Reescribe cada oración corrigiendo el error de concordancia entre demostrativo y sustantivo.",
      ejemplo: {
        pregunta: "These book are very green. → ?",
        respuesta: "These books are very green. (book → books)"
      },
      estimulo: "Corrige el error de concordancia:",
      campos: [
        {
          id: "s2_r4_oracion1",
          tipo: "text",
          label: "1. These book are on the table. (Corrige el error)",
          placeholder: "These books are on the table.",
          maxLength: 100,
          required: true,
          valorCorrecto: ["These books are on the table."]
        },
        {
          id: "s2_r4_oracion2",
          tipo: "text",
          label: "2. That pens are blue. (Corrige el error)",
          placeholder: "Those pens are blue.",
          maxLength: 100,
          required: true,
          valorCorrecto: ["Those pens are blue."]
        },
        {
          id: "s2_r4_oracion3",
          tipo: "text",
          label: "3. This shoes are new. (Corrige el error)",
          placeholder: "These shoes are new.",
          maxLength: 100,
          required: true,
          valorCorrecto: ["These shoes are new."]
        }
      ],
      puntos: 15,
      tiempoEstimado: "6 min",
      referenciaTeoria: "Demonstratives and Articles - Página 6",
      config: {
        placeholder: "Reescribe la oración corregida..."
      }
    },
    {
      id: "s2_r5",
      titulo: "Reporte Escrito: Mi Espacio de Estudio",
      tipo: "textarea",
      instruccion: "Redacta un párrafo descriptivo de 5-8 oraciones sobre tu espacio de estudio actual. Usa al menos 3 demostrativos (this, that, these, those) y 2 artículos (a, an, the).",
      instrucciones: "Escribe un párrafo describiendo tu espacio de estudio. Debe incluir: al menos 3 demostrativos y 2 artículos. Mínimo 50 palabras.",
      ejemplo: {
        pregunta: "Describe tu espacio de estudio:",
        respuesta: "In my study space, this desk is very organized. I have a laptop and some notebooks. Those books on the shelf are for my English class. The whiteboard on the wall has my schedule. These pens are new and work very well."
      },
      estimulo: "Escribe tu reporte descriptivo:",
      campos: [
        {
          id: "s2_r5_reporte",
          tipo: "textarea",
          label: "Mi Espacio de Estudio (mínimo 50 palabras)",
          placeholder: "In my study space, this/that desk is... I have a/an... Those/These books are... The whiteboard is...",
          maxLength: 500,
          required: true
        }
      ],
      puntos: 25,
      tiempoEstimado: "10 min",
      referenciaTeoria: "Demonstratives and Articles - Página 6",
      config: {
        placeholder: "In my classroom, this whiteboard is clean. Those chairs are near the window..."
      }
    }
  ],
  3: [
    {
      id: "s3_r1",
      titulo: "Adjetivos Posesivos (Possessive Adjectives)",
      tipo: "fill-blanks",
      instruccion: "Completa cada oración usando el adjetivo posesivo correcto (My, Your, His, Her, Its, Our, Their) según el sujeto indicado.",
      instrucciones: "Escribe el adjetivo posesivo correcto para cada oración. Recuerda: My (mi), Your (tu), His (de él), Her (de ella), Its (de ello), Our (nuestro), Their (de ellos).",
      ejemplo: {
        pregunta: "_____ cat's name is Luna. (El gato de Mary)",
        respuesta: "Her cat's name is Luna."
      },
      estimulo: "Completa con el adjetivo posesivo correcto:",
      campos: [
        {
          id: "s3_r1_oracion1",
          tipo: "text",
          label: "1. _____ cat's name is Luna. (Mary tiene un gato)",
          placeholder: "Her",
          maxLength: 20,
          required: true,
          valorCorrecto: ["Her"]
        },
        {
          id: "s3_r1_oracion2",
          tipo: "text",
          label: "2. _____ car is blue. (John tiene un auto)",
          placeholder: "His",
          maxLength: 20,
          required: true,
          valorCorrecto: ["His"]
        },
        {
          id: "s3_r1_oracion3",
          tipo: "text",
          label: "3. _____ parents are teachers. (Nosotros - nuestros padres)",
          placeholder: "Our",
          maxLength: 20,
          required: true,
          valorCorrecto: ["Our"]
        },
        {
          id: "s3_r1_oracion4",
          tipo: "text",
          label: "4. _____ house is big. (Ellos - su casa)",
          placeholder: "Their",
          maxLength: 20,
          required: true,
          valorCorrecto: ["Their"]
        },
        {
          id: "s3_r1_oracion5",
          tipo: "text",
          label: "5. _____ name is Carlos. (Tú - tu nombre)",
          placeholder: "Your",
          maxLength: 20,
          required: true,
          valorCorrecto: ["Your"]
        }
      ],
      puntos: 20,
      tiempoEstimado: "7 min",
      referenciaTeoria: "Genitive Case & Possessives - Página 8",
      config: {
        placeholder: "Escribe el posesivo correcto..."
      }
    },
    {
      id: "s3_r2",
      titulo: "Caso Genitivo ('s) - Posesión Directa",
      tipo: "error-check",
      instruccion: "Reescribe cada oración usando el genitivo sajón ('s) en lugar de la preposición 'of'. Elimina la traducción literal del español.",
      instrucciones: "Convierte 'of + nombre' a nombre + 's'. Ejemplo: 'The office of my father' → 'My father's office'.",
      ejemplo: {
        pregunta: "The office of my father is local. → ?",
        respuesta: "My father's office is local."
      },
      estimulo: "Reescribe usando el genitivo sajón:",
      campos: [
        {
          id: "s3_r2_oracion1",
          tipo: "text",
          label: "1. The office of my father is local.",
          placeholder: "My father's office is local.",
          maxLength: 100,
          required: true,
          valorCorrecto: ["My father's office is local."]
        },
        {
          id: "s3_r2_oracion2",
          tipo: "text",
          label: "2. The car of my sister is new.",
          placeholder: "My sister's car is new.",
          maxLength: 100,
          required: true,
          valorCorrecto: ["My sister's car is new."]
        },
        {
          id: "s3_r2_oracion3",
          tipo: "text",
          label: "3. The books of the students are on the table.",
          placeholder: "The students' books are on the table.",
          maxLength: 100,
          required: true,
          valorCorrecto: ["The students' books are on the table."]
        }
      ],
      puntos: 15,
      tiempoEstimado: "6 min",
      referenciaTeoria: "Genitive Case & Possessives - Página 8",
      config: {
        placeholder: "Escribe la oración con genitivo sajón..."
      }
    },
    {
      id: "s3_r3",
      titulo: "Vocabulario: Mi Familia (Family Members)",
      tipo: "vocabulary",
      instruccion: "Escribe los nombres en inglés de 6 miembros de tu familia. Incluye parentesco y nombre propio.",
      instrucciones: "Escribe 6 miembros de tu familia con su parentesco en inglés. Ejemplo: 'mother - María'.",
      ejemplo: {
        pregunta: "Mi mamá se llama María → ?",
        respuesta: "mother - María"
      },
      estimulo: "Escribe 6 miembros de tu familia:",
      campos: [
        {
          id: "s3_r3_familiar1",
          tipo: "text",
          label: "1. (Ej: mother - María)",
          placeholder: "parentesco - nombre",
          maxLength: 50,
          required: true
        },
        {
          id: "s3_r3_familiar2",
          tipo: "text",
          label: "2.",
          placeholder: "parentesco - nombre",
          maxLength: 50,
          required: true
        },
        {
          id: "s3_r3_familiar3",
          tipo: "text",
          label: "3.",
          placeholder: "parentesco - nombre",
          maxLength: 50,
          required: true
        },
        {
          id: "s3_r3_familiar4",
          tipo: "text",
          label: "4.",
          placeholder: "parentesco - nombre",
          maxLength: 50,
          required: true
        },
        {
          id: "s3_r3_familiar5",
          tipo: "text",
          label: "5.",
          placeholder: "parentesco - nombre",
          maxLength: 50,
          required: true
        },
        {
          id: "s3_r3_familiar6",
          tipo: "text",
          label: "6.",
          placeholder: "parentesco - nombre",
          maxLength: 50,
          required: true
        }
      ],
      puntos: 15,
      tiempoEstimado: "5 min",
      referenciaTeoria: "Genitive Case & Possessives - Página 8",
      config: {
        placeholder: "parentesco - nombre"
      }
    },
    {
      id: "s3_r4",
      titulo: "Diálogo: Presentando a la Familia",
      tipo: "dialogo",
      instruccion: "Completa el diálogo presentando a tu familia al tutor IA. Escribe las líneas del Alumno (líneas 1 y 3) usando adjetivos posesivos y genitivo sajón.",
      instrucciones: "Escribe tus respuestas para las líneas 1 y 3. Usa 'My father's...', 'My mother's...', 'His/Her...' en tus respuestas.",
      ejemplo: {
        pregunta: "01. Alumno: (Presenta a tu padre)",
        respuesta: "My father's name is Roberto. He is an engineer."
      },
      estimulo: "Presenta a tu familia al tutor IA:",
      campos: [
        {
          id: "s3_r4_linea1",
          tipo: "text",
          label: "01. Alumno: (Presenta a tu padre - usa 'My father's...')",
          placeholder: "Ej: My father's name is... He is...",
          maxLength: 150,
          required: true
        },
        {
          id: "s3_r4_linea2",
          tipo: "text",
          label: "02. Tutor IA: That is beautiful. What is your father's job? And how old is your sister?",
          placeholder: "(Línea predefinida del tutor)",
          required: false
        },
        {
          id: "s3_r4_linea3",
          tipo: "text",
          label: "03. Alumno: (Responde sobre el trabajo de tu padre y la edad de tu hermana)",
          placeholder: "Ej: My father is a teacher. My sister is 18 years old.",
          maxLength: 200,
          required: true
        },
        {
          id: "s3_r4_linea4",
          tipo: "text",
          label: "04. Tutor IA: Wonderful! You have a lovely family. Let's practice possessive pronouns next.",
          placeholder: "(Línea predefinida del tutor)",
          required: false
        }
      ],
      puntos: 15,
      tiempoEstimado: "8 min",
      referenciaTeoria: "Genitive Case & Possessives - Página 8",
      config: {
        promptIA1: "That is beautiful. What is your father's job? And how old is your sister?",
        promptIA2: "Wonderful! You have a lovely family. Let's practice possessive pronouns next."
      }
    },
    {
      id: "s3_r5",
      titulo: "Redacción: Mi Árbol Familiar",
      tipo: "textarea",
      instruccion: "Redacta un párrafo de 5-8 oraciones describiendo tu familia inmediata. Usa al menos: 3 adjetivos posesivos (my, his, her) y 2 genitivos sajones ('s).",
      instrucciones: "Escribe un párrafo describiendo tu familia. Debe incluir: al menos 3 posesivos y 2 genitivos sajones. Mínimo 50 palabras.",
      ejemplo: {
        pregunta: "Describe tu familia:",
        respuesta: "In my family, my father's name is Roberto. He is an engineer. My mother is a teacher. Her students love her. My sister's hobby is painting. Our house is in Monterrey. Their pets are two dogs."
      },
      estimulo: "Escribe la descripción de tu familia:",
      campos: [
        {
          id: "s3_r5_familia",
          tipo: "textarea",
          label: "Mi Familia (mínimo 50 palabras, usa posesivos y genitivos)",
          placeholder: "In my family, my father's name is... My mother is... His/Her... Our... Their...",
          maxLength: 500,
          required: true
        }
      ],
      puntos: 25,
      tiempoEstimado: "10 min",
      referenciaTeoria: "Genitive Case & Possessives - Página 8",
      config: {
        placeholder: "In my family, my father's name is Robert. My mother has two dogs..."
      }
    }
  ],
  4: [
    {
      id: "s4_r1",
      titulo: "Reglas de Mayúsculas (Capitalization)",
      instruccion: "Corrige y reescribe la oración con las mayúsculas correctas para nacionalidades e idiomas: \"she speaks spanish and english in mexico.\"",
      tipo: "error-check",
      config: {
        placeholder: "Escribe la oración corregida...",
        correctKeywords: ["She", "Spanish", "English", "Mexico"],
        errorKeywords: ["spanish", "english", "mexico"],
        errorMessage: "🤖 ¡Atención a las mayúsculas en los idiomas (Spanish, English) y países (Mexico)!"
      }
    },
    {
      id: "s4_r2",
      titulo: "Glosario de Países y Gentilicios",
      instruccion: "Escribe 3 gentilicios o nacionalidades en inglés con mayúscula inicial:",
      tipo: "glosario",
      config: {
        placeholder: "Mexican, French, Japanese..."
      }
    },
    {
      id: "s4_r3",
      titulo: "Preposiciones de Lugar: From / In",
      instruccion: "Completa con 'from' o 'in' de acuerdo con las procedencias geográficas:",
      tipo: "inputs-dobles",
      config: {
        labelA: "Procedencia nacional (ej. I am... Mexico)",
        labelB: "Ubicación urbana (ej. I live... Monterrey)",
        placeholderA: "I am from Mexico",
        placeholderB: "I live in Monterrey"
      }
    },
    {
      id: "s4_r4",
      titulo: "Diálogo: Control de Pasaportes",
      instruccion: "Completa la simulación de entrevista migratoria respondiendo al oficial de aduana virtual:",
      tipo: "dialogo",
      config: {
        label1: "01. Alumno:",
        label2: "02. Tutor IA:",
        label3: "03. Alumno:",
        label4: "04. Tutor IA:",
        promptIA1: "Passport please. Where are you from today and what languages do you speak?",
        promptIA2: "Perfect. Have a great stay here! Enjoy your travel experiences."
      }
    },
    {
      id: "s4_r5",
      titulo: "Redacción de Formulario de Aduana",
      instruccion: "Escribe una declaración formal de propósitos de viaje indicando de dónde vienes, qué idioma dominas y cuánto tiempo te quedarás en la ciudad:",
      tipo: "textarea",
      config: {
        placeholder: "I am traveling from Mexico. I speak Spanish and English. I am visiting for research..."
      }
    }
  ],
  5: [
    {
      id: "s5_r1",
      titulo: "Artículos Definidos e Indefinidos",
      instruccion: "Completa usando 'a', 'an' o 'the' según corresponda: \"I have ___ apple and ___ orange on ___ desk.\"",
      tipo: "inputs-dobles",
      config: {
        labelA: "Espacio 1 y 2 (Frutas)",
        labelB: "Espacio 3 (Mobiliario)",
        placeholderA: "an apple and an orange",
        placeholderB: "on the desk"
      }
    },
    {
      id: "s5_r2",
      titulo: "Glosario de Deportes y Hobbys",
      instruccion: "Registra tres deportes o actividades de ocio populares en inglés:",
      tipo: "glosario",
      config: {
        placeholder: "Escribe deportes (soccer, swimming, gaming...)"
      }
    },
    {
      id: "s5_r3",
      titulo: "Gramática: Artículos y Aficiones",
      instruccion: "Identifica y corrige el error común relacionado al uso de artículos: \"I like a playing the soccer.\"",
      tipo: "error-check",
      config: {
        placeholder: "Escribe la oración corregida sin artículos redundantes...",
        correctKeywords: ["i", "like", "playing", "soccer"],
        errorKeywords: ["the soccer", "a playing"],
        errorMessage: "🤖 Por regla general, no se utiliza 'the' ni 'a' antes del nombre de los deportes (I like playing soccer)."
      }
    },
    {
      id: "s5_r4",
      titulo: "Diálogo: Mi Fin de Semana Libre",
      instruccion: "Simula coordinar planes deportivos y de esparcimiento saludable con tu tutor IA:",
      tipo: "dialogo",
      config: {
        label1: "01. Alumno:",
        label2: "02. Tutor IA:",
        label3: "03. Alumno:",
        label4: "04. Tutor IA:",
        promptIA1: "I love outdoor sports. Do you play any sports or have an active weekend hobby?",
        promptIA2: "Awesome! We should organize a friendly match or a project group workout soon."
      }
    },
    {
      id: "s5_r5",
      titulo: "Ensayo Pequeño: Mi Pasatiempo Favorito",
      instruccion: "Escribe un breve ensayo de 40 palabras justificando por qué tu pasatiempo favorito impacta de forma positiva tu vida diaria:",
      tipo: "textarea",
      config: {
        placeholder: "My favorite hobby is reading. It allows me to learn new words and relax after a busy day..."
      }
    }
  ]
};

// Generar de forma sofisticada juegos de 5 ejercicios excelentes para las semanas 6 a 18
const temasSemana: Record<number, { tema: string; keywordA: string; keywordB: string }> = {
  6: { tema: "Descripción Física de Personas y Adjetivos de Aspecto", keywordA: "he is tall and thin", keywordB: "she has friendly brown eyes" },
  7: { tema: "Actividades de la Rutina Diaria (Por la Mañana)", keywordA: "I wake up at seven", keywordB: "I eat breakfast with coffee" },
  8: { tema: "Rutina de Trabajo y Actividades por la Tarde", keywordA: "he works in the office", keywordB: "we usually have lunch together" },
  9: { tema: "Hábitos Nocturnos, Descanso y Fin de la Jornada", keywordA: "I read a book before bed", keywordB: "it helps me sleep better" },
  10: { tema: "Ubicación Espacial, Habitaciones y Muebles de Casa", keywordA: "there is a table in the room", keywordB: "there are chairs next to it" },
  11: { tema: "Medios de Transporte y Traslados en la Ciudad", keywordA: "I take the subway to go", keywordB: "we drive through the streets" },
  12: { tema: "El Tiempo de Ocio y Frecuencia de Actividades", keywordA: "I practice twice a week", keywordB: "she seldom plays video games" },
  13: { tema: "Alimentos, Nutrición Básica y Menú de Casa", keywordA: "there is some milk in the fridge", keywordB: "we do not have any apples left" },
  14: { tema: "Habilidades Cotidianas, Talentos y Capacidades", keywordA: "I can speak English well", keywordB: "he cannot run very quickly" },
  15: { tema: "Estaciones del Año, Ropa y Clima Diario", keywordA: "it is raining outside", keywordB: "I need to wear a heavy coat" },
  16: { tema: "Compras en Tiendas, Precios y Regateo Básico", keywordA: "how much is this jacket", keywordB: "how many apples do you want" },
  17: { tema: "Fórmulas de Cortesía, Permisos y Pedir Favor", keywordA: "could you help me please", keywordB: "may I borrow your dictionary" },
  18: { tema: "Planificación Vacacional y Deseos para el Verano", keywordA: "I want to visit London next", keywordB: "we are planning a summer trip" }
};

for (let i = 6; i <= 18; i++) {
  const info = temasSemana[i];
  reactivosPorSemana[i] = [
    {
      id: `s${i}_r1`,
      titulo: `Gramática y Estructura - Ejercicio 1 (Semana ${i})`,
      instruccion: `Corrige la concordancia o redacción de este enunciado vinculado a: ${info.tema}`,
      tipo: "error-check",
      config: {
        placeholder: "Escribe la corrección oficial aquí...",
        correctKeywords: info.keywordA.split(" "),
        errorKeywords: ["no subject", "bad conjugation"],
        errorMessage: `🤖 Recuerda repasar las reglas de construcción aprendidas para ${info.tema}.`
      }
    },
    {
      id: `s${i}_r2`,
      titulo: `Vocabulario Aplicado - Ejercicio 2 (Semana ${i})`,
      instruccion: `Completa los dos campos utilizando expresiones clave del tema semanal:`,
      tipo: "inputs-dobles",
      config: {
        labelA: "Estructura Base / Práctica A",
        labelB: "Estructura Secundaria / Práctica B",
        placeholderA: info.keywordA,
        placeholderB: info.keywordB
      }
    },
    {
      id: `s${i}_r3`,
      titulo: `Glosario de Sesión síncrona - Ejercicio 3 (Semana ${i})`,
      instruccion: `Escribe 3 palabras clave en inglés relacionadas al tema: ${info.tema}:`,
      tipo: "glosario",
      config: {
        placeholder: "Término 1, Término 2, Término 3..."
      }
    },
    {
      id: `s${i}_r4`,
      titulo: `Chat Práctico Conversacional - Ejercicio 4 (Semana ${i})`,
      instruccion: `Completa la conversación interactiva con tu tutor de Inteligencia Artificial para comprobar asimilación de contenidos:`,
      tipo: "dialogo",
      config: {
        label1: "01. Alumno:",
        label2: `02. Tutor IA (Semana ${i}):`,
        label3: "03. Alumno:",
        label4: `04. Tutor IA (Semana ${i}):`,
        promptIA1: `Interesting comment! How do you apply this in¹ your personal routine?`,
        promptIA2: `I completely agree. That represents excellent comprehension of this week's content. Let's keep exploring.`
      }
    },
    {
      id: `s${i}_r5`,
      titulo: `Ensayo de Nivelación - Ejercicio 5 (Semana ${i})`,
      instruccion: `Escribe una disertación práctica corta (mínimo 30 palabras) fundamentando tus ejemplos prácticos del tema: ${info.tema}`,
      tipo: "textarea",
      config: {
        placeholder: `Write your text about ${info.tema} here...`
      }
    }
  ];
}
