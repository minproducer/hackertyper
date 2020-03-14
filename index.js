/*
 * Code được tham khảo trên trang của Hackertyper.com
 */

const main = '#main';
const newLineRegex = new RegExp('\n', 'g'); // dòng mới
const spaceRegex = new RegExp('\\s', 'g'); // khoảng trắng
const tabRegex = new RegExp('\\t', 'g'); // tab
const keyCode = {
  backspace: 8,
  f11: 122
};

$(function() {
  $(document).keydown(function(event) {
    Typer.addText(event);
  });
});

const Typer = {
  text: null,
  index: 0, // vị trí con trỏ hiện tại
  speed: 5, // tốc độ gõ, mặc định là 3 ký tự mỗi khi nhấn
  file: '',

  init: () => {
    setInterval(function() {
      Typer.updateLastChar();
    }, 500); // đặt thời gian cho blink cursor

    $.get(Typer.file, function(data) {
      Typer.text = data; // lưu nội dung file code
    });
  },

  content: () => $(main).html(),

  write: str => {
    $(main).append(str);

    return false;
  },

  addText: key => {
    if (Typer.text) {
      const cont = Typer.content(); // nội dung đã được in ra

      // nếu nội dung cuối cùng là blinking cursor
      if (cont.substring(cont.length - 1, cont.length) == '|') {
        $(main).html(
          $(main)
            .html()
            .substring(0, cont.length - 1)
        ); // xóa chuỗi có bao gồm blink cursor
      }

      // đặt lại index đến vị trí sau cùng
      if (key.keyCode != keyCode.backspace) Typer.index += Typer.speed;
      else {
        // nếu index lớn hơn 0 và keycode là backspace thì index - speed
        if (Typer.index > 0) Typer.index -= Typer.speed;
      }

      let newText = $(main)
        .text(Typer.text.substring(0, Typer.index))
        .html(); // cập nhật text mới

      newText = newText
        .replace(newLineRegex, '<br/>') // nếu text có bao gồm xuống dòng thì chuyển thành
        .replace(tabRegex, '&nbsp;&nbsp;&nbsp;&nbsp;') // nếu là tab thì thêm 4 khoảng trắng
        .replace(spaceRegex, '&nbsp;'); // nếu là khoảng trắng thì thay bằng non-breaking space

      $(main).html(newText); // in nội dung mới ra màn hình

      window.scrollBy(0, 50); // scroll để  màn hình luôn hiển thị text mới
    }

    // cho phép phóng to màn hình
    if (key.preventDefault && key.keyCode != keyCode.f11) {
      key.preventDefault();
    }

    if (key.keyCode != keyCode.f11) {
      key.returnValue = false;
    }
  },

  updateLastChar: () => {
    // blinking cursor
    const cont = Typer.content();

    // nếu ký tự cuối cùng là blink cursor
    if (cont.substring(cont.length - 1, cont.length) == '|') {
      const tempText = $(main)
        .html()
        .substring(0, cont.length - 1);

      $(main).html(tempText); // xóa blink cursor
    } else {
      Typer.write('|'); // ngược lại, in blink cursor
    }
  }
};
