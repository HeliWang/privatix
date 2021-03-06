import { expect } from 'chai';
import 'mocha';

import { WS } from '../../utils/ws';
import { TestInputSettings } from '../../typings/test-models';

export function wsInitializationTest(settings: TestInputSettings) {
  const { configs } = settings;

  describe('set up websockets', () => {
    it('initialize agent websocket connection', async () => {
      this.agentWs = new WS(configs['agentWsEndpoint']);

      // wait for ws ready
      await this.agentWs.whenReady();
    });

    it('initialize client websocket connection', async () => {
      this.clientWs = new WS(configs['clientWsEndpoint']);

      // wait for ws ready
      await this.clientWs.whenReady();
    });

    describe('setting passwords', () => {
      let agentPwd: string;
      let clientPwd: string;

      it('should generate agent and client passwords', () => {

        agentPwd = Math.random().toString(36).substring(5);
        clientPwd = Math.random().toString(36).substring(5);

        expect(agentPwd.length).to.be.greaterThan(6);
        expect(clientPwd.length).to.be.greaterThan(6);
        // expect(agentPwd).to.not.equal(clientPwd);
      });

      it('should set agent password', async () => {

        if('AGENT_PWD' in process.env){
          agentPwd = process.env.AGENT_PWD;
        }

        const res = await this.agentWs.setPassword(agentPwd);

        expect(res).to.be.true;

      });

      it('should set client password', async () => {
        if('CLIENT_PWD' in process.env){
          clientPwd = process.env.CLIENT_PWD;
        }

        const res = await this.clientWs.setPassword(clientPwd);

        expect(res).to.be.true;

      });

      it('should fail with wrong agent password', async () => {
        await this.agentWs.setPassword('wrongPasswd')
            .catch(e => {
                expect(e.code).to.equal(-32000);
            });

        // Set right password
        await this.agentWs.setPassword(agentPwd);
      });
    });
  });
}
