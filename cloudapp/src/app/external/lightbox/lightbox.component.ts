import { Component, OnInit, HostListener, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss']
})
export class LightboxComponent implements OnInit {
  @Input() images: Array<string>;
  @Input() headers = {};
  slideIndex = 0;
  loading = true;
  src: string;
  
  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {
  }

  openModal() {
    document.getElementById('imgModal').style.display = "block";
  }

  closeModal() {
    document.getElementById('imgModal').style.display = "none";
  }

  nextImage(n: number) {
    this.showImage(this.slideIndex += n);
  }

  currentSlide(n: number) {
    this.showImage(this.slideIndex = n);
  }

  showImage(n) {
    if (n > this.images.length) this.slideIndex = 1;
    if (n < 1) this.slideIndex = this.images.length;
    this.loading = true;
    this.http.get(this.images[this.slideIndex-1], { responseType: 'blob', headers: this.headers })
    .pipe(finalize(() => this.loading = false))
    .subscribe( {
      next: res => this.imageFromBlob(res),
      error: e => console.error(e.message)
    });
  }

  imageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === 'string') {
        this.src = reader.result;
      }
    }, false);
 
    if (image) {
       reader.readAsDataURL(image);
    }
 }

  @HostListener('document:keydown.escape', ['$event']) 
  escapeHandler(event: KeyboardEvent) {
    this.closeModal();
  }
}

  