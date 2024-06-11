import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { UserService } from '../../../../myCargonaut-server/src/user/user.service';
import { DeleteUserComponent } from './delete-user.component';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('DeleteUserComponent', () => {
  let component: DeleteUserComponent;
  let fixture: ComponentFixture<DeleteUserComponent>;
  let userService: UserService;
  let httpTestingController: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteUserComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [UserService]
    });

    fixture = TestBed.createComponent(DeleteUserComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  afterEach(() => {
    httpTestingController.verify();
  });



  it('should call deleteUser if the user is logged in', fakeAsync(() => {
    const mockResponse = [{}];
    //spyOn(userService, 'deleteUser').and.callThrough(); //after merge it should contains something like this

    //userService.checkLoginBeforeDeleteUser(); //same here

    const req = httpTestingController.expectOne('http://localhost:8000/session/checkLogin');
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);

    tick();
   // expect(userService.deleteUser).toHaveBeenCalled();
  }));

  it('should not call deleteUser if the user is not logged in', fakeAsync(() => {
    const mockResponse: string | number | boolean | Object | null = [];
   // spyOn(userService, 'deleteUser').and.callThrough();

    //userService.checkLoginBeforeDeleteUser();

    const req = httpTestingController.expectOne('http://localhost:8000/session/checkLogin');
    expect(req.request.method).toEqual('GET');
    req.flush(mockResponse);

    tick();
   // expect(userService.deleteUser).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('User is not logged in and has not rights to delete this Profil.');
  }));

  it('should navigate to root and clear session storage on successful user deletion', fakeAsync(() => {
    const mockResponse = {};
    spyOn(sessionStorage, 'clear');

   // userService.deleteUser();

    const req = httpTestingController.expectOne('http://localhost:8000/user');
    expect(req.request.method).toEqual('PUT');
    req.flush(mockResponse);

    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(sessionStorage.clear).toHaveBeenCalled();
  }));
});
