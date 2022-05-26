import * as Yup from 'yup';

export const matchSchema = Yup.object({
  buildUpTime: Yup.date()
    .required('Required')
    .min(new Date(), 'Cannot be in the past'),
  startTime: Yup.date()
    .required('Required')
    .min(Yup.ref('buildUpTime'), 'Cannot precede the warm up time'),
  endTime: Yup.date()
    .required('Required')
    .min(Yup.ref('startTime'), 'Cannot precede the kick off time'),
});
