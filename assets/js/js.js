const input_clp = document.getElementById("input_clp");
const select_moneda_a_convertir = document.getElementById(
  "select_moneda_a_convertir"
);
const btn_buscar = document.getElementById("btn_buscar");
const span_resultado_conversion = document.getElementById(
  "span_resultado_conversion"
);
const canvas_grafico = document.getElementById("canvas_grafico");

const apiUrl = "https://mindicador.cl/api";

let myChart = null;
function formaDate(date){
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return `${day}/${month}/${year};`
}

/*Renderizado grafico*/
function renderGrafico(data) {
    const config = {
      type: "line",
      data: {
        labels: data.map((element) => formaDate(new Date(element.fecha))),
        datasets: [
          {
            label: "ultimos dies dias",
            backgroundColor: "red",
            data: data.map((elem) => elem.valor),
          }
        ],
      },
    };
    canvas_grafico.style.backgroundColor = "white";
    if(myChart){
      myChart.destroy();
    }
    myChart = new Chart(canvas_grafico,config)
  }

  async function buscarCotizacion() {
    try {
      const cantidad = input_clp.value;
      const moneda = select_moneda_a_convertir.value;
      const fetching = await fetch(`${apiUrl}/${moneda}`);
      const data = await fetching.json();

      const valorConvertido = cantidad / data.serie[0].valor;
  
      return { valorConvertido, data };
    } catch (error) {
      span_resultado_conversion.innerHTML = "Ha ocurrido un error";
    }
  }

/*Accion al hacer click */
btn_buscar.addEventListener("click", async () => {
  span_resultado_conversion.innerHTML = `
    Cargando...
  `
  const { valorConvertido, data } = await buscarCotizacion();
  const lastValue = data.serie[0].valor;
  const serie = data.serie.slice(0, 10).reverse();
  span_resultado_conversion.innerHTML = `
    La Cotización del día es ${lastValue}. El valor convertido es: ${valorConvertido.toFixed(2)}
  `;
  renderGrafico(serie);
});

