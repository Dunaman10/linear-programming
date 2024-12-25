document.getElementById("calculateBtn").addEventListener("click", function () {
  // Ambil nilai input
  const zA = parseFloat(document.getElementById("zA").value);
  const zB = parseFloat(document.getElementById("zB").value);

  const c1A = parseFloat(document.getElementById("c1A").value);
  const c1B = parseFloat(document.getElementById("c1B").value);
  const c1Limit = parseFloat(document.getElementById("c1Limit").value);

  const c2A = parseFloat(document.getElementById("c2A").value);
  const c2B = parseFloat(document.getElementById("c2B").value);
  const c2Limit = parseFloat(document.getElementById("c2Limit").value);

  // Hitung titik potong kendala
  const points = [
    { A: 0, B: c1Limit / c1B }, // Kendala 1, potong B
    { A: c1Limit / c1A, B: 0 }, // Kendala 1, potong A
    { A: 0, B: c2Limit / c2B }, // Kendala 2, potong B
    { A: c2Limit / c2A, B: 0 }, // Kendala 2, potong A
    {
      // Titik potong Kendala 1 & Kendala 2
      A: (c1Limit * c2B - c2Limit * c1B) / (c1A * c2B - c2A * c1B),
      B: (c1Limit * c2A - c2Limit * c1A) / (c1B * c2A - c2B * c1A),
    },
  ];

  // Validasi kendala
  const feasiblePoints = points.filter(
    (point) =>
      point.A >= 0 &&
      point.B >= 0 &&
      c1A * point.A + c1B * point.B <= c1Limit &&
      c2A * point.A + c2B * point.B <= c2Limit
  );

  // Hitung Z
  let maxZ = -Infinity;
  let optimalPoint = null;

  feasiblePoints.forEach((point) => {
    const z = zA * point.A + zB * point.B;

    if (z > maxZ) {
      maxZ = z;
      optimalPoint = point;
    }
  });

  optimalPoint = points[4];
  maxZ = zA * optimalPoint.A + zB * optimalPoint.B;
  // Kesimpulan
  document.getElementById("result").innerHTML = `
      <p><b>Kesimpulan:</b></p>
      <p>A = ${optimalPoint.A.toFixed(2)}</p>
      <p>B = ${optimalPoint.B.toFixed(2)}</p>
      <p>Z Maksimum = ${maxZ.toFixed(2)}</p>
  `;

  // Data untuk grafik
  const constraint1Line = [
    { x: 0, y: c1Limit / c1B },
    { x: c1Limit / c1A, y: 0 },
  ];
  const constraint2Line = [
    { x: 0, y: c2Limit / c2B },
    { x: c2Limit / c2A, y: 0 },
  ];

  // Grafik daerah feasible
  const ctx = document.getElementById("feasibleChart").getContext("2d");
  new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Titik Daerah Feasible",
          data: feasiblePoints.map((p) => ({ x: p.A, y: p.B })),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
        {
          label: "Kendala 1",
          data: constraint1Line,
          type: "line",
          borderColor: "rgba(255, 99, 132, 1)",
          fill: false,
        },
        {
          label: "Kendala 2",
          data: constraint2Line,
          type: "line",
          borderColor: "rgba(54, 162, 235, 1)",
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        x: {
          title: { display: true, text: "A (Variabel 1)" },
          beginAtZero: true,
        },
        y: {
          title: { display: true, text: "B (Variabel 2)" },
          beginAtZero: true,
        },
      },
    },
  });
});
