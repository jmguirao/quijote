
import xlsx from 'node-xlsx'
import { readFile } from 'node:fs/promises';


type Entrada = {
	lema: string,
	campo: string
}

const hoja_antonio = xlsx.parse('./data/QUIJOTE-nombres-campos-semanticos.xlsx')
const entradas     = Lista_lemas(hoja_antonio)
const lista_campos = Lista_campos(entradas)

for (const campo of lista_campos) {
	const lemas = Lemas_de(campo, entradas)
	
	for (const lema of lemas) {
		await Saca_definición_de(lema)
	}
}



async function Saca_definición_de(lema: string) {
	const primera_letra = lema[0]

	const p_letra = primera_letra.replace(/á/, 'a').replace(/é/, 'e').replace(/í/, 'i').replace(/ó/, 'o').replace(/ú/, 'u')

	const file_name = `./drae/entradas/${p_letra}-lem/${lema}`

	try {
    const contenido = await readFile(file_name, 'utf8');
    //console.log(contenido);
  } catch (error) {
    console.error(file_name );
  }	
}

function Lemas_de(campo_e: string, entradas: Entrada[]) {
	const lemas: string[] = []
	for (const entrada of entradas) {
		const {lema, campo} = entrada
		if (campo_e === campo) lemas.push(lema)
	}
	return lemas
}

function Lista_campos(entradas: Entrada[]): Set<string> {

	const campos: Set<string> = new Set()
	for (const entrada of entradas) {
		const {campo} = entrada
		campos.add(campo)
	}
	return campos
}


function Lista_lemas(workSheetsFromFile) {

	const entradas: Entrada[] = []

	// Array de campos semánticos
	for (const workSheet of workSheetsFromFile) {
	 	const {name, data} = workSheet
		const campo = String(name)

	  // console.log(`\n--- Campo Semántico: ${name}`)
	 	for (const fila of data) {
			const columna = String(fila)
			const entrada = String(columna.match(/^[a-záéíóúñü]+/))
			entradas.push({lema: entrada, campo})
	 	}
	}
	return entradas.sort()
}