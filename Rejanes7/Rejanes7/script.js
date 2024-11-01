document.addEventListener('DOMContentLoaded', () => {
    const reservationForm = document.getElementById('reservation-form');

    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const guests = document.getElementById('guests').value;


        alert(`Reserva realizada com sucesso!\n\nNome: ${name}\nEmail: ${email}\nData: ${date}\nHora: ${time}\nNúmero de Pessoas: ${guests}`);

        reservationForm.reset();
    });

    //Menu responsivo
    const nav = document.querySelector('header nav');
    const navToggle = document.createElement('button');
    navToggle.textContent = '☰';
    navToggle.classList.add('nav-toggle');
    nav.insertBefore(navToggle, nav.firstChild);

    navToggle.addEventListener('click', () => {
        const navUl = document.querySelector('header nav ul');
        navUl.classList.toggle('show');
    });
});


  // Inicializar o Supabase
  const supabaseUrl = 'https://gyfobdcobwfxomgsapxf.supabase.co';  // substitua pela URL do seu projeto
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5Zm9iZGNvYndmeG9tZ3NhcHhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg0ODU4OTIsImV4cCI6MjA0NDA2MTg5Mn0.0oIMO3MDQ7gitYcRMG6ZhB6rjfdq-X7JZ9ufaHo52-w';  // substitua pela sua chave pública
  const supabase = Supabase.createClient(supabaseUrl, supabaseKey);


  async function fetchReservas() {
    let { data: reservas, error } = await supabase
      .from('reservas')
      .select('*');  // busca todos os dados da tabela 'reservas'

    if (error) {
      console.error('Erro ao buscar reservas:', error);
    } else {
      console.log('Reservas:', reservas);
    }
}



