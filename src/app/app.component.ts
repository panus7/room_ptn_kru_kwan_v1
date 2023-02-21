import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import masterdata from './masterdata.json';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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
        StudyDate: this.fromDate,
        SubjectID: this.mSubjectID,
        SubjectDescription: this.mSubjectMemo,
        Cxl: '',
        ListData: [
          {
            ImageData: '',
            ImageDesc: '',
            LinkUrl: '',
            FileName: '',
          },
        ],
      },
    };

    var filesAmount = this.urls.length;
    for (let i = 0; i < filesAmount; i++) {
      update.param.ListData.push(this.urls[i]);
    }
    console.log(update);
  }

  public UpdateStudyDate(data: any): Observable<any> {
    return this.http.post<any>(
      'http://203.154.55.194:8999/RestService.svc/' + 'UpdateStudyDate',
      data
    );
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
