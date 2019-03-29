import './index.scss';
import 'material-design-lite';

let gender: HTMLInputElement[];

const addDetail = async function (detail: { name: string, value: string }) {
  await localStorage.setItem(detail.name, detail.value);
};

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    const name = document.getElementById('player_name') as HTMLInputElement;
    // Add a close functionality to the Cancel button.
    document.getElementById('later').addEventListener('click', () => {
      window.location.href = 'http://dir.bg';
    });
    document.getElementById('play').addEventListener('click', () => {
      addDetail({ name: 'username', value: name.value })
        .then(() => {
          gender = Array.from(document.getElementsByName('gender') as NodeListOf<HTMLInputElement>)
            .filter((el: HTMLInputElement) => el.checked);
          addDetail({ name: 'gender', value: gender[0].value })
            .then(() => {
              console.info(localStorage.getItem('username'));
              console.info(localStorage.getItem('gender'));
              window.location.href = 'http://localhost:8080/';
            });
        });
    });
  }
};
