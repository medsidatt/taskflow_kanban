# Contributing to TaskFlow Kanban

Thank you for your interest in contributing to TaskFlow Kanban! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to maintain a welcoming and inclusive community.

## Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/taskflow-kanban.git
   cd taskflow-kanban
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Set up development environment**
   ```bash
   # Backend
   cd backend
   mvn clean install

   # Frontend
   cd frontend
   npm install
   ```

## Development Workflow

### Backend Development

1. **Code Structure**
   - Follow the layered architecture: Controller → Service → Repository
   - Use DTOs for API contracts
   - Implement proper exception handling
   - Add JavaDoc comments for public methods

2. **Database Changes**
   - Create Flyway migration scripts for schema changes
   - Use naming convention: `V{version}__{description}.sql`
   - Test migrations on clean database

3. **Testing**
   - Write unit tests for service layer
   - Write integration tests for repositories
   - Maintain minimum 80% code coverage

### Frontend Development

1. **Component Structure**
   - Use standalone components
   - Separate smart and dumb components
   - Follow Angular style guide
   - Use TypeScript strict mode

2. **Styling**
   - Use component-level CSS
   - Follow BEM naming convention
   - Ensure responsive design
   - Test on multiple browsers

3. **State Management**
   - Use services for state
   - Implement reactive patterns with RxJS
   - Avoid memory leaks (unsubscribe)

## Coding Standards

### Backend (Java/Spring Boot)

```java
// Good
@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {
    private final BoardRepository boardRepository;
    private final BoardMapper boardMapper;
    
    @Override
    @Transactional(readOnly = true)
    public BoardDto getBoard(Long id) {
        Board board = boardRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Board not found"));
        return boardMapper.toDto(board);
    }
}

// Bad - Missing transaction, exception handling
public class BoardService {
    @Autowired
    private BoardRepository repo;
    
    public Board getBoard(Long id) {
        return repo.findById(id).get();
    }
}
```

### Frontend (TypeScript/Angular)

```typescript
// Good
@Component({
  selector: 'app-board-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board-card.component.html',
  styleUrls: ['./board-card.component.css']
})
export class BoardCardComponent implements OnInit, OnDestroy {
  @Input() card!: Card;
  @Output() cardUpdated = new EventEmitter<Card>();
  
  private destroy$ = new Subject<void>();
  
  ngOnInit(): void {
    // Subscribe with cleanup
    this.someObservable$
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// Bad - No cleanup, imperative code
export class BoardCard {
  card: any;
  
  ngOnInit() {
    this.someObservable$.subscribe();
  }
}
```

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
feat(board): add drag and drop for cards

Implement drag and drop functionality using Angular CDK.
Users can now reorder cards within columns and move cards between columns.

Closes #123

---

fix(auth): resolve token refresh loop

Fixed infinite loop in token refresh interceptor that occurred
when refresh token was expired.

Fixes #456

---

docs(readme): update installation instructions

Added Docker setup instructions and troubleshooting section.
```

## Pull Request Process

1. **Before Creating PR**
   - Update your branch with latest main
   - Run all tests and ensure they pass
   - Update documentation if needed
   - Run linters and fix issues

2. **PR Title and Description**
   - Use descriptive title
   - Reference related issues
   - Describe changes and reasoning
   - Add screenshots for UI changes

3. **PR Template**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## How Has This Been Tested?
   Describe testing approach
   
   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Comments added for complex code
   - [ ] Documentation updated
   - [ ] No new warnings generated
   - [ ] Tests added/updated
   - [ ] All tests pass
   ```

4. **Review Process**
   - Address review comments
   - Keep discussions professional
   - Update PR based on feedback

## Testing Guidelines

### Backend Tests

```java
// Unit Test Example
@ExtendWith(MockitoExtension.class)
class BoardServiceTest {
    @Mock
    private BoardRepository boardRepository;
    
    @InjectMocks
    private BoardServiceImpl boardService;
    
    @Test
    void getBoard_whenBoardExists_returnsBoard() {
        // Given
        Board board = createTestBoard();
        when(boardRepository.findById(1L)).thenReturn(Optional.of(board));
        
        // When
        BoardDto result = boardService.getBoard(1L);
        
        // Then
        assertNotNull(result);
        assertEquals(board.getId(), result.getId());
    }
}

// Integration Test Example
@SpringBootTest
@AutoConfigureTestDatabase
class BoardRepositoryIntegrationTest {
    @Autowired
    private BoardRepository boardRepository;
    
    @Test
    void findByWorkspaceId_returnsBoards() {
        // Test with actual database
    }
}
```

### Frontend Tests

```typescript
// Component Test
describe('BoardCardComponent', () => {
  let component: BoardCardComponent;
  let fixture: ComponentFixture<BoardCardComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardCardComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(BoardCardComponent);
    component = fixture.componentInstance;
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should emit cardUpdated when card is modified', () => {
    spyOn(component.cardUpdated, 'emit');
    component.updateCard();
    expect(component.cardUpdated.emit).toHaveBeenCalled();
  });
});

// Service Test
describe('BoardService', () => {
  let service: BoardService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BoardService]
    });
    
    service = TestBed.inject(BoardService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  it('should fetch boards', () => {
    const mockBoards = [{ id: 1, name: 'Test Board' }];
    
    service.getBoards().subscribe(boards => {
      expect(boards).toEqual(mockBoards);
    });
    
    const req = httpMock.expectOne('/api/boards');
    expect(req.request.method).toBe('GET');
    req.flush(mockBoards);
  });
});
```

## Documentation

### Code Documentation

1. **Backend (JavaDoc)**
   ```java
   /**
    * Creates a new board in the specified workspace
    * 
    * @param workspaceId The ID of the workspace
    * @param boardDto The board creation data
    * @return The created board DTO
    * @throws ResourceNotFoundException if workspace not found
    * @throws ForbiddenException if user lacks permission
    */
   BoardDto createBoard(Long workspaceId, BoardCreateDto boardDto);
   ```

2. **Frontend (JSDoc)**
   ```typescript
   /**
    * Fetches all boards for the current user
    * 
    * @returns Observable of board array
    * @throws Error if request fails
    */
   getBoards(): Observable<Board[]> {
     return this.http.get<Board[]>(API_ENDPOINTS.BOARDS.BASE);
   }
   ```

### README Updates

- Update setup instructions for new dependencies
- Add examples for new features
- Update API documentation
- Keep architecture diagrams current

## Questions?

If you have questions about contributing, please open an issue with the `question` label.

Thank you for contributing to TaskFlow Kanban! 🚀
