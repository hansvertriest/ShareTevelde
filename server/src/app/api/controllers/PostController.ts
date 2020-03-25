import { NextFunction, Request, Response } from 'express';

const mockPosts = [
  {
    id: '0',
    title: 'Netwerken Ziggo en KPN toch niet open',
    synopsis:
      'Wat die Belgen kunnen, kunnen wij ook. Dat was en is wellicht een van de gedachten in de hoofden van de ACM-medewerkers die zich bezighouden met het toezicht op de breedbandmarkt in Nederland.',
    publisedAt: Date.now(),
  },
  {
    id: '1',
    title:
      'VodafoneZiggo breekt onderhandelingen met dienstenaanbieders op kabel af',
    synopsis:
      'VodafoneZiggo heeft partijen met interesse voor toegang tot de kabel laten weten dat de lopende onderhandelingen worden gestopt. Dat is het gevolg van de rechterlijke uitspraak van afgelopen dinsdag, waardoor KPN en VodafoneZiggo hun netwerken niet hoeven te openen voor derden.',
    publisedAt: Date.now(),
  },
];

class PostController {
  public index(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Response<any> | void {
    res.status(200).json(mockPosts);
  }

  public show(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Response<any> | void {
    const { id } = req.params;
    const post = mockPosts.find(obj => obj.id === id);
    res.status(200).json(post);
  }
}

export default PostController;
