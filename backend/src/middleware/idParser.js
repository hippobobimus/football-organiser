import { AppEvent } from '../models';

export const parseEventId = async (req, res, next) => {
  if (req.params.eventId === 'next-match') {
    const query = await AppEvent.find({
      category: 'match',
      'time.end': { $gte: new Date() },
      isCancelled: false,
    })
      .sort({
        'time.end': 'asc',
      })
      .limit(1);

    if (query.length === 0) {
      // no upcoming matches
      return res.status(204).json(null);
    }

    req.params.eventId = query[0].id;
  }

  return next();
};
