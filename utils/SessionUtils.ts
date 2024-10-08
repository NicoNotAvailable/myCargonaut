import {SessionService} from "../myCargonaut-client/src/app/services/session.service";

export class SessionUtils {
    static checkLoginRedir(sessionService: SessionService, redirRoute: string): boolean {
        sessionService.checkLoginNum().then(isLoggedIn => {
            return isLoggedIn != -1;
        });
        return false;
    }
}
