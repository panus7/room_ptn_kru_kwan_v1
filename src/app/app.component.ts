import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import masterdata from './masterdata.json';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { forEachChild } from 'typescript';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  masterData: any;
  fromDate: any;
  fromDateName = '';
  mSubjectID = '';
  mSubjectName = '';
  mSubjectMemo = '';
  urls = [];

  constructor(private modalService: NgbModal, private http: HttpClient) {
    this.masterData = masterdata;
    console.log(this.masterData);
    let myDate = new Date();
    this.fromDateName =
      myDate.getFullYear() +
      '-' +
      ('0' + (myDate.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + myDate.getDate()).slice(-2);
    console.log(this.fromDate);
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          console.log(event.target.result);
          this.urls.push(event.target.result);
        };

        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  ngOnInit() {
    let myDate = new Date();
    this.fromDateName =
      myDate.getFullYear() +
      '-' +
      ('0' + (myDate.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + myDate.getDate()).slice(-2);
  }

  public open(modal: any): void {
    this.modalService.open(modal);
  }

  public submit_class() {
    let update = {
      param: {
        ContextKey: 'ReU',
        RoomNo: this.masterData.RoomNo,
        StudyDate: this.fromDate + 'T00:00:00',
        SubjectID: this.mSubjectID,
        SubjectDescription: this.mSubjectMemo,
        Cxl: '',
        ListData: [],
      },
    };

    var filesAmount = this.urls.length;
    for (let i = 0; i < filesAmount; i++) {
      let imgdata = this.urls[i];
      console.log(imgdata);

      let itemImg = null;
      if (imgdata.startsWith('data:application/pdf;')) {
        itemImg = {
          ImageData: imgdata,
          ImageDesc: '',
          LinkUrl: '',
          FileName: '' + i + '.pdf',
        };
      } else {
        itemImg = {
          ImageData: imgdata,
          ImageDesc: '',
          LinkUrl: '',
          FileName: '' + i + '.jpg',
        };
      }

      if (itemImg) update.param.ListData.push(itemImg);
    }
    console.log(update);

    this.UpdateStudyDate(update).subscribe((response: any) => {
      console.log(response);
      window.alert('Updated');
      window.location.reload();
    });
  }

  public UpdateStudyDate(data: any): Observable<any> {
    // var res = this.http.post<any>(
    //   'https://dev-logic.net/DxHope/RestService.svc/UpdateStudyDate',
    //   { data }
    // );
    //return res;

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    let url = 'https://dev-logic.net/DxHope/RestService.svc/UpdateStudyDate';
    return this.http.post<any>(url, JSON.stringify(data), { headers: headers });
  }
}

export interface ListData {
  ImageData: string;
  ImageDesc: string;
  LinkUrl: string;
  FileName: string;
}

export interface DataParam {
  ContextKey: string;
  RoomNo: string;
  StudyDate: string;
  SubjectID: string;
  SubjectDescription: string;
  Cxl: string;
  ListData: ListData[];
}

export interface UpdateParam {
  param: DataParam;
}
