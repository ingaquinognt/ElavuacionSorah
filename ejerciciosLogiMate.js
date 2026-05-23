//Código creado por Javier Aquino Cano - Prueba Técnica Sorah



function ejercicio1(texto) { //Función para recibir un texto y regresar el texto con cada palabra invertida
    var separarTexto = texto.split(" ");
    var palabrasInvertidas = separarTexto.map(function(palabra) {
        return palabra.split("").reverse().join("");
    });
    var textoInverso = palabrasInvertidas.join(" ");
    return textoInverso;
}

console.log("Ejercicio 1: " + ejercicio1("Esta frase tendrá cada palabra invertida")); // Salida: "atsE esarf árdnet adac arbalap aditrevni"

function ejercicio2(numeros) { //Función para recibir un array de números y regresar pares únicos sin repetir
    var numerosPares = [];
    var numerosParesUnicos = [];
    for (var i = 0; i < numeros.length; i++) {
        if (numeros[i] % 2 === 0) {
            numerosPares.push(numeros[i]);
        }
    }
    for (var j = 0; j < numerosPares.length; j++) {
        var repetido = false;
        for (var k = 0; k < numerosParesUnicos.length; k++) {
            if (numerosPares[j] === numerosParesUnicos[k]) {
                repetido = true;
                break;
            }
        }
        if (!repetido) {
            numerosParesUnicos.push(numerosPares[j]);
        }
    }
    return numerosParesUnicos;
}

console.log("Ejercicio 2: " + ejercicio2([1,2,3,4,5,6,7,2,4,6,8,6])); // Salida: [2, 4, 6, 8]

function ejercicio3(inicio, fin) { //Función para recibir dos enteros inicio y fin y regresar una lista de pares de números primos gemelos dentro del rango
    var primosGemelos = [];
    for (var i = inicio; i <= fin; i++) {
        if (esPrimo(i) && esPrimo(i + 2) && i <= fin && (i + 2) <= fin) {
            primosGemelos.push([i, i + 2]);
        }
    }
    return primosGemelos;
}

console.log("Ejercicio 3: " + JSON.stringify(ejercicio3(100, 150))); // Salida: [[101, 103], [107, 109], [137, 139]]

function esPrimo(num) { //Función para verificar si un número es primo
    if (num <= 1) return false;
    for (var i = 2; i < num; i++) {
        if (num % i === 0) {
            return false;
        }
    }
    return true;
}

function ejercicio4(numeros, objetivo) { //Función para recibir un array de números y un número objetivo, y valide si existe una combinación de números en el array que sumen el número objetivo sin repetir números del array y con mínimo dos números
    var existeCombinacion = false;
    var sumaGuardada = 0;
    var sumaActual = 0;
    for (var i = 0; i < numeros.length; i++) {
        for (var j = i + 1; j < numeros.length; j++) {
            if(sumaGuardada === 0) {
                if(numeros[i] + numeros[j] === objetivo) {
                    existeCombinacion = true;
                }
                if(numeros[i] + numeros[j] < objetivo) {
                    sumaGuardada = numeros[i] + numeros[j];
                }
            }
           else {
              if(sumaGuardada + numeros[j] === objetivo) {
                existeCombinacion = true;
              }
              if(sumaGuardada + numeros[j] < objetivo) {
                   sumaGuardada += numeros[j];
                }
            }
        }
    }
    return existeCombinacion;
}

console.log("Ejercicio 4: " + JSON.stringify(ejercicio4([55,3,8,11,45,1], 12))); // Salida: true (3 + 8 + 1 = 12)

